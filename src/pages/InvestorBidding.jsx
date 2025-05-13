import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, TextField, Container } from "@mui/material";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const InvestorBidding = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bids, setBids] = useState({});

  useEffect(() => {
    const fetchApprovedOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const approvedOrders = allOrders.filter(order => order.status === "approved");
      setOrders(approvedOrders);
    };

    fetchApprovedOrders();
  }, []);

  const handleBidChange = (orderId, amount) => {
    setBids(prev => ({ ...prev, [orderId]: amount }));
  };

  const submitBid = async (orderId) => {
    const bidAmount = bids[orderId];
    if (!bidAmount) return;

    await addDoc(collection(db, "orders", orderId, "bids"), {
      investorId: currentUser.uid,
      investorEmail: currentUser.email,
      amount: parseFloat(bidAmount),
      timestamp: new Date(),
    });

    toast.success("Bid submitted!");
    setBids(prev => ({ ...prev, [orderId]: "" }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Approved Orders - Place Your Bid</Typography>
      {orders.map(order => (
        <Card key={order.id} sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="subtitle1">Order ID: {order.id}</Typography>
            {order.items.map((item, idx) => (
              <Typography key={idx}>{item.name} x {item.quantity}</Typography>
            ))}
            <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
              <TextField
                type="number"
                label="Bid Amount"
                value={bids[order.id] || ""}
                onChange={e => handleBidChange(order.id, e.target.value)}
                size="small"
                sx={{
                  mr: 2,
                  '& input::-webkit-outer-spin-button': { display: 'none' },
                  '& input::-webkit-inner-spin-button': { display: 'none' },
                  '& input[type=number]': { MozAppearance: 'textfield' }
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => submitBid(order.id)}
                sx={{ height: '40px' }} // Optional: match height explicitly
              >
                Submit Bid
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default InvestorBidding;