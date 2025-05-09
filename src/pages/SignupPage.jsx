import { useState } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ROLES from "../utils/constants";
import { toast } from "react-toastify";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: ROLES.CONTRACTOR,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;
  
      // Save additional user info like role & kycVerified in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: form.email,
        role: form.role,
        kycVerified: false, // Admin must approve
      });

      navigate("/login");
      console.log("User created:", user.uid);
    } catch (error) {
      toast.error(error.message);
      console.error("Signup error:", error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              value={form.password}
              onChange={handleChange}
            />
            <TextField
              select
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              fullWidth
            >
              {Object.entries(ROLES).map(([key, label]) => (
                <MenuItem key={key} value={label}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" color="primary" type="submit">
              Create Account
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}