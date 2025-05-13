import { useState } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
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

      await setDoc(doc(db, "users", user.uid), {
        email: form.email,
        role: form.role,
        kycVerified: false,
      });

      toast.success("Account created!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      console.error("Signup error:", error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} display="flex" justifyContent="center">
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 480 }}
        >
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Fill in your details to get started.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email Address"
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
                label="Select Role"
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

              <Button variant="contained" type="submit" size="large">
                Sign Up
              </Button>
            </Stack>
          </form>

          <Box mt={3}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Button variant="text" onClick={() => navigate("/login")}>
                Log in
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
