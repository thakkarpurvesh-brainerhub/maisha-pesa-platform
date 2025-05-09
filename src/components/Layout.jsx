import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component={Link} to="/dashboard" sx={{ color: "white", textDecoration: "none" }}>
            Maisha Pesa - Tenderpreneur Transaction Platform
          </Typography>

          <Box>
            {!currentUser ? (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Signup
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="inherit" // Inherit color from the parent, allowing us to customize styles
                sx={{
                  borderColor: 'white', // Set border color to white
                  color: 'white', // Set font color to white
                  '&:hover': {
                    borderColor: '#fff', // Make sure the border remains white on hover
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: Light hover background color
                  },
                }}
                onClick={handleLogout}
              >
                Log Out
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Page content goes here */}
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;