import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasAttemptedLogin && currentUser) {
      navigate("/dashboard");
    }
  }, [hasAttemptedLogin, currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Logged in successfully!");
      setHasAttemptedLogin(true);
    } catch (error) {
      toast.error("Invalid email or password");
      console.error("Login error:", error.message);
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
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Enter your credentials to access your dashboard.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
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
              <Button variant="contained" type="submit" size="large">
                Log In
              </Button>
            </Stack>
          </form>

          <Box mt={3}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Button variant="text" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
