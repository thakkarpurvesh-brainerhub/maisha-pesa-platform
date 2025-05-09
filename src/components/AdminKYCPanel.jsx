import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import ROLES from "../utils/constants";

export default function AdminKYCPanel() {
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchUnverifiedUsers = async () => {
    const q = query(collection(db, "users"), where("kycVerified", "==", false), where("role", "!=", ROLES.ADMIN));
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPendingUsers(users);
  };

  useEffect(() => {
    fetchUnverifiedUsers();
  }, []);

  const handleVerify = async (userId) => {
    await updateDoc(doc(db, "users", userId), {
      kycVerified: true,
    });
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  if (pendingUsers.length === 0) {
    return <Typography>No pending KYC verifications.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Pending KYC Verifications
      </Typography>
      <Grid container spacing={2}>
        {pendingUsers.map((user) => (
          <Grid item xs={12} sm={6} key={user.id}>
            <Card>
              <CardContent>
                <Typography>Email: {user.email}</Typography>
                <Typography>Role: {user.role}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleVerify(user.id)}
                  sx={{ mt: 2 }}
                >
                  Verify
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}