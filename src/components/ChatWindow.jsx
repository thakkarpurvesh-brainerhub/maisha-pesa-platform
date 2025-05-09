// components/ChatWindow.jsx
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, Paper } from "@mui/material";

export default function ChatWindow({ chatId, currentUserId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetched);
    });

    return () => unsubscribe();
  }, [chatId]);

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: 2,
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg) => (
          <Paper
            key={msg.id}
            sx={{
              padding: 1,
              mb: 1,
              backgroundColor:
                msg.senderId === currentUserId ? "#e3f2fd" : "#f1f1f1",
              alignSelf:
                msg.senderId === currentUserId ? "flex-end" : "flex-start",
              maxWidth: "75%",
            }}
          >
            <Typography variant="body2">{msg.text}</Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(msg.timestamp?.toDate()).toLocaleString()}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
