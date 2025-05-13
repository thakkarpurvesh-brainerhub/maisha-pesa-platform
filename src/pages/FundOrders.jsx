import { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardContent, Container } from "@mui/material";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function FundOrders() {
  const { currentUser } = useAuth();
  const [ordersToFund, setOrdersToFund] = useState([]);

  useEffect(() => {
    const fetchOrdersToFund = async () => {
      // Fetch all orders where the current user is the winning investor and status is 'funding'
      const q = query(
        collection(db, "orders"),
        where("winningInvestor", "==", currentUser.uid),
        where("status", "==", "funding")
      );
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrdersToFund(orders);
    };

    fetchOrdersToFund();
  }, [currentUser]);

  const handleFundOrder = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);

    // Update the order status to "funded"
    await updateDoc(orderRef, {
      status: "funded",
      fundedAt: new Date(),
    });

    toast.success("Order funded successfully!");
    setOrdersToFund(ordersToFund.filter((order) => order.id !== orderId)); // Remove funded order from list
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Funding Orders</Typography>

      {ordersToFund.length === 0 ? (
        <Typography>No orders available to fund.</Typography>
      ) : (
        ordersToFund.map((order) => (
          <Card key={order.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography>Order ID: {order.id}</Typography>
              <Typography>Items: {order.items.map(item => `${item.name} x ${item.quantity}`).join(", ")}</Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => handleFundOrder(order.id)}
              >
                Fund Order
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}