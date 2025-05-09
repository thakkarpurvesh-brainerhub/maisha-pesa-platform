import { useState, useEffect, useMemo } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // adjust this import to your setup
import { useAuth } from "../contexts/AuthContext"; // assuming you use AuthContext

const ChatRoom = ({ otherUserId }) => {
  const { currentUser } = useAuth(); // get logged-in user
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

   // Generate consistent chatId from uid pair
   const chatId = useMemo(() => {
    if (!currentUser || !otherUserId) return null;
    const uidPair = [currentUser.uid, otherUserId].sort();
    return `chat_${uidPair[0]}_${uidPair[1]}`;
  }, [currentUser, otherUserId]);

  const messagesRef = collection(db, "chats", chatId, "messages");
  console.log("messagesRef", messagesRef);
  useEffect(() => {
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Messages:", msgs);
      setMessages(msgs);
    },
    (error) => {
      console.error("Firestore error:", error); // Add this
    });
    return unsubscribe;
  }, [chatId]);

  async function ensureChatExists() {
    const chatRef = doc(db, "chats", chatId);
    console.log("chatRef", chatRef);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: [currentUser.uid, otherUserId],
        createdAt: Timestamp.now(),
      });
      console.log("Chat created.");
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    await ensureChatExists();

    await addDoc(messagesRef, {
      text: input,
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      timestamp: Timestamp.now()
    });

    setInput("");
  };
console.log('messages', messages)
  return (
    <Box>
      <Typography variant="h6">Chat</Typography>
      <Box sx={{ minHeight: 200, mb: 2 }}>
        {messages.map(msg => (
          <Typography key={msg.id}>
            <strong>{msg.senderEmail || msg.senderId}{currentUser.uid === msg.senderId ? " (You)" : ""}:</strong> {msg.text}
          </Typography>
        ))}
      </Box>
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        fullWidth
      />
      <Button variant="contained" onClick={handleSend} sx={{ mt: 1 }}>
        Send
      </Button>
    </Box>
  );
};

export default ChatRoom;