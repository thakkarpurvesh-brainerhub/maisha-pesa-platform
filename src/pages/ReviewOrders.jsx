import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const ReviewOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
        const q = query(
            collection(db, "orders"),
            where("assignedTo", "==", currentUser.uid),
            where("status", "==", "pending_approval")
          );
          const snapshot = await getDocs(q);
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const pending = all.filter(
        order =>
          order.assignedTo === currentUser.uid
      );
      setOrders(pending);
    };

    fetchOrders();
  }, [currentUser]);

  const handleAction = async (id, status) => {
    const ref = doc(db, "orders", id);
    await updateDoc(ref, { status });
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Review Pending Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography color="text.secondary">No pending orders to review.</Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map(order => (
            <Card key={order.id} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Order ID: {order.id}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="subtitle2" gutterBottom>Items:</Typography>
                <Stack spacing={0.5} ml={1}>
                  {order.items.map((item, idx) => (
                    <Typography key={idx}>
                      • <strong>{item.name}</strong> — {item.quantity} ({item.description || "No description"})
                    </Typography>
                  ))}
                </Stack>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAction(order.id, "approved")}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleAction(order.id, "rejected")}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ReviewOrders;