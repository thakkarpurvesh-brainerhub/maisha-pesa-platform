import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import ChatRoom from "./ChatRoom";
import ROLES from "../utils/constants";

const ChatSelector = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));

      const allUsers = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      
        let oppositeRole = null;
        if (currentUser.role === ROLES.CONTRACTOR) {
            oppositeRole = ROLES.BROKER;
        } else if (currentUser.role === ROLES.BROKER) {
            oppositeRole = ROLES.CONTRACTOR;
        }

        const filtered = allUsers.filter(
            user => user.uid !== currentUser.uid && user.role === oppositeRole
        );
        setUsers(filtered);
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Start a Chat
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {users.map(user => (
          <Button
            key={user.uid}
            variant="outlined"
            onClick={() => setSelectedUserId(user.uid)}
          >
            Chat with {user.email} ({user.role})
          </Button>
        ))}
      </Box>

      {selectedUserId && (
        <Box mt={4}>
          <ChatRoom otherUserId={selectedUserId} />
        </Box>
      )}
    </Box>
  );
};

export default ChatSelector;