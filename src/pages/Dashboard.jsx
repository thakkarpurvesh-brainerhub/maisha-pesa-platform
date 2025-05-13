import { Container, Typography, Box, Button, Paper, Stack } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminKYCPanel from "../components/AdminKYCPanel";
import ChatSelector from "../components/ChatSelector";
import ROLES from "../utils/constants";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return <Typography>Loading...</Typography>;

  const renderTopActions = () => {
    if (currentUser.role !== ROLES.ADMIN && !currentUser.kycVerified) return null;

    switch (currentUser.role) {
      case ROLES.CONTRACTOR:
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/review-order")}
            sx={{ ml: 2 }}
          >
            Review Orders
          </Button>
        );

      case ROLES.BROKER:
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/create-order")}
              sx={{ ml: 2 }}
            >
              Create Order
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/bidded-orders")}
            >
              View Orders with Bids
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  const renderDashboardContent = () => {
    if (currentUser.role !== ROLES.ADMIN && !currentUser.kycVerified) {
      return (
        <Paper sx={{ p: 3, mt: 2, backgroundColor: "#fff3e0" }}>
          <Typography color="error">
            Your account is pending KYC verification. Please wait for admin approval.
          </Typography>
        </Paper>
      );
    }

    switch (currentUser.role) {
      case ROLES.ADMIN:
        return (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Admin Panel
            </Typography>
            <AdminKYCPanel />
          </Paper>
        );

      case ROLES.CONTRACTOR:
      case ROLES.BROKER:
        return (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6">{currentUser.role} Dashboard</Typography>
            <ChatSelector />
          </Paper>
        );

      case ROLES.INVESTOR:
        return (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6">Investor Dashboard</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/bidding")}
              >
                View Approved Orders to Bid
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/fund-orders")}
              >
                Fund Winning Orders
              </Button>
            </Stack>
          </Paper>
        );

      case ROLES.SOURCING_AGENT:
        return (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6">Sourcing Agent Dashboard</Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate("/allocate-items")}
            >
              Allocate Items
            </Button>
          </Paper>
        );

      case ROLES.CLIENT:
        return (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6">
              Client Dashboard: Track your order statuses in real-time
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate("/track-orders")}
            >
              Track Orders
            </Button>
          </Paper>
        );

      default:
        return <Typography>Unknown role</Typography>;
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 1,
            mb: 3
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Welcome, {currentUser.email}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{
                backgroundColor: "#e0f7fa",
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                mt: 1,
                borderRadius: 1,
                fontWeight: 500
              }}
            >
              Role: {currentUser.role}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            {renderTopActions()}
          </Stack>
        </Box>
        {renderDashboardContent()}
      </Box>
    </Container>
  );
}
