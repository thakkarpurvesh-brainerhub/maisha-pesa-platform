import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Stack,
  Container,
} from "@mui/material";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import ROLES from "../utils/constants";

const CreateOrder = () => {
  const { currentUser } = useAuth();
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState("");
  const [item, setItem] = useState({ name: "", quantity: "", description: "" });

  useEffect(() => {
    const fetchContractors = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      const filtered = users.filter(u => u.role === ROLES.CONTRACTOR && u.kycVerified);
      setContractors(filtered);
    };
    fetchContractors();
  }, []);

  const handleSubmit = async () => {
    if (!selectedContractor || !item.name.trim() || !item.quantity.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        createdBy: currentUser.uid,
        assignedTo: selectedContractor,
        items: [item],
        status: "pending_approval",
        createdAt: new Date(),
      });

      setSelectedContractor("");
      setItem({ name: "", quantity: "", description: "" });
      toast.success("Order created successfully!");
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Error creating order.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Create New Order
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Contractor</InputLabel>
            <Select
              value={selectedContractor}
              onChange={(e) => setSelectedContractor(e.target.value)}
              label="Contractor"
              required
            >
              {contractors.map((c) => (
                <MenuItem key={c.uid} value={c.uid}>
                  {c.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Item Name"
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Quantity"
            value={item.quantity}
            onChange={(e) => setItem({ ...item, quantity: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={item.description}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Submit Order
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreateOrder;
