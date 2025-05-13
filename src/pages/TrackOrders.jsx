import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Card, Typography, Divider, Container } from "@mui/material";

export default function TrackOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  console.log(orders)
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("status", "==", "allocated")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(updatedOrders);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Your Orders</Typography>
      {orders.length === 0 ? (
        <Typography>No allocated orders to track at the moment.</Typography>
      ) : (
        orders.map(order => (
          <Card key={order.id} sx={{ p: 2, my: 2 }}>
            <Typography fontWeight="bold">Order ID: {order.id}</Typography>
            <Typography>Status: {order.status}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography fontWeight="medium">Items:</Typography>
            {order.items && order.items.map((item, index) => (
              <Typography key={index}>
                • {item.name} — {item.quantity} pcs
                {item.description && ` (${item.description})`}
                {item.allocatedTo && (
                  <> — <strong>Allocated To:</strong> {item.allocatedTo}</>
                )}
              </Typography>
            ))}
          </Card>
        ))
      )}
    </Container>
  );
}