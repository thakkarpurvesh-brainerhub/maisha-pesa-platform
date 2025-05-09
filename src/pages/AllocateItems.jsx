import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button
} from "@mui/material";
import { toast } from "react-toastify";

export default function AllocateItems() {
  const [orders, setOrders] = useState([]);
  const [allocations, setAllocations] = useState({});

  useEffect(() => {
    const fetchFundedOrders = async () => {
      const q = query(collection(db, "orders"), where("status", "==", "funded"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };
    fetchFundedOrders();
  }, []);

  const handleChange = (orderId, index, value) => {
    setAllocations(prev => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [index]: value
      }
    }));
  };

  const handleSubmit = async (orderId, items) => {
    const updatedItems = items.map((item, i) => ({
      ...item,
      allocatedTo: allocations[orderId]?.[i] || ""
    }));

    await updateDoc(doc(db, "orders", orderId), {
      items: updatedItems,
      status: "allocated"
    });

    toast.success("Items allocated.");
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Allocate Items</Typography>

      {orders.length === 0 ? (
        <Typography>No funded orders available.</Typography>
      ) : (
        orders.map(order => (
          <Card key={order.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography>Order ID: {order.id}</Typography>
              {order.items.map((item, idx) => (
                <Box key={idx} sx={{ mt: 2 }}>
                  <Typography>{item.name} x {item.quantity}</Typography>
                  <TextField
                    label="Allocate To (Person/Dept)"
                    fullWidth
                    value={allocations[order.id]?.[idx] || ""}
                    onChange={e => handleChange(order.id, idx, e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => handleSubmit(order.id, order.items)}
              >
                Submit Allocation
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}