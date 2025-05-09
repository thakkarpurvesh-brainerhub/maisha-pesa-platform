import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { toast } from "react-toastify";

export default function SelectWinningBid() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchBidsAndOrder = async () => {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);
      setOrder({ id: orderSnap.id, ...orderSnap.data() });

      const bidsSnap = await getDocs(collection(orderRef, "bids"));
      const bidsData = bidsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBids(bidsData);
    };

    fetchBidsAndOrder();
  }, [orderId]);

  const handleSelectWinner = async (bid) => {
    const orderRef = doc(db, "orders", orderId);

    await updateDoc(orderRef, {
      winningInvestor: bid.investorId,
      status: "funding"
    });

    toast.success("Winning bid selected.");
    navigate("/dashboard"); // or wherever you'd like
  };

  if (!order) return <Typography>Loading order...</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Select Winning Bid</Typography>

      {bids.length === 0 ? (
        <Typography>No bids for this order yet.</Typography>
      ) : (
        bids.map((bid) => (
          <Card key={bid.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography>Investor: {bid.investorEmail}</Typography>
              <Typography>Amount: {bid.amount}</Typography>
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => handleSelectWinner(bid)}
              >
                Select as Winner
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
