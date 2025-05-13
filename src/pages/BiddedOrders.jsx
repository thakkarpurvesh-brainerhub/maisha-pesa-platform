import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Container
} from "@mui/material";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function BiddedOrders() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [biddedOrders, setBiddedOrders] = useState([]);

  useEffect(() => {
    const fetchOrdersWithBids = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const orders = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(order => order.createdBy === currentUser.uid && order.status === "approved");

          const filtered = [];
        for (const order of orders) {
          const bidsSnap = await getDocs(collection(db, "orders", order.id, "bids"));
          if (!bidsSnap.empty) {
            filtered.push({ ...order, bidsCount: bidsSnap.size });
          }
        }

        setBiddedOrders(filtered);
      } catch (error) {
        console.error("Failed to fetch bidded orders:", error);
        toast.error("Error fetching orders with bids");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithBids();
  }, [currentUser.uid]);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Orders Ready for Bid Selection
      </Typography>

      {biddedOrders.length === 0 ? (
        <Typography>No approved orders with bids yet.</Typography>
      ) : (
        biddedOrders.map(order => (
          <Card key={order.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="body1">Order ID: {order.id}</Typography>
              <Typography variant="body2"># of Bids: {order.bidsCount}</Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate(`/select-winning-bid/${order.id}`)}
              >
                Select Winning Bid
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}