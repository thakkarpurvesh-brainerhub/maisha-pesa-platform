import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Chip,
} from "@mui/material";
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

      const allUsers = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      let oppositeRole = null;
      if (currentUser.role === ROLES.CONTRACTOR) {
        oppositeRole = ROLES.BROKER;
      } else if (currentUser.role === ROLES.BROKER) {
        oppositeRole = ROLES.CONTRACTOR;
      }

      const filtered = allUsers.filter(
        (user) => user.uid !== currentUser.uid && user.role === oppositeRole
      );
      setUsers(filtered);
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Start a Chat
        </Typography>
        {users.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No available users to chat with.
          </Typography>
        ) : (
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            mt={2}
            alignItems="center"
          >
            {users.map((user) => (
              <Button
                key={user.uid}
                variant={selectedUserId === user.uid ? "contained" : "outlined"}
                onClick={() => setSelectedUserId(user.uid)}
                sx={{
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  px: 2,
                  py: 1.5,
                  minWidth: 180,
                  gap: 0.5,
                }}
              >
                <Typography variant="body1">{user.email}</Typography>
                <Chip
                  label={user.role}
                  size="small"
                  color="info"
                  sx={{ mt: 0.5 }}
                />
              </Button>
            ))}
          </Stack>
        )}
      </Paper>

      {selectedUserId && (
        <Box mt={4}>
          <ChatRoom otherUserId={selectedUserId} />
        </Box>
      )}
    </Box>
  );
};

export default ChatSelector;
