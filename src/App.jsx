import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";
import CreateOrder from "./pages/CreateOrder";
import ReviewOrders from "./pages/ReviewOrders";
import Layout from "./components/Layout";
import InvestorBidding from "./pages/InvestorBidding";
import SelectWinningBid from "./pages/SelectWinningBid";
import BiddedOrders from "./pages/BiddedOrders";
import FundOrders from "./pages/FundOrders";
import AllocateItems from "./pages/AllocateItems";
import TrackOrders from "./pages/TrackOrders";
import ROLES from "./utils/constants";

export default function App() {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  const redirectIfLoggedIn = (Component) =>
    currentUser ? <Navigate to="/dashboard" replace /> : <Component />;
  return (
    <Router>
      <Routes>
        {/* Public Routes with Redirect if logged in */}
        <Route element={<Layout />}>
          <Route path="/login" element={redirectIfLoggedIn(LoginPage)} />
          <Route path="/signup" element={redirectIfLoggedIn(SignupPage)} />

          {/* Layout-wrapped Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Broker Routes */}
          {currentUser?.role === ROLES.BROKER && (
            <>
              <Route path="/create-order" element={<PrivateRoute><CreateOrder /></PrivateRoute>} />
              <Route path="/bidded-orders" element={<PrivateRoute><BiddedOrders /></PrivateRoute>} />
              <Route path="/select-winning-bid/:orderId" element={<PrivateRoute><SelectWinningBid /></PrivateRoute>} />
            </>
          )}

          {/* Contractor Route */}
          {currentUser?.role === ROLES.CONTRACTOR && (
            <Route path="/review-order" element={<PrivateRoute><ReviewOrders /></PrivateRoute>} />
          )}

          {/* Investor Routes */}
          {currentUser?.role === ROLES.INVESTOR && (
            <>
              <Route path="/bidding" element={<PrivateRoute><InvestorBidding /></PrivateRoute>} />
              <Route path="/fund-orders" element={<PrivateRoute><FundOrders /></PrivateRoute>} />
            </>
          )}

          {/* Sourcing Agent */}
          {currentUser?.role === ROLES.SOURCING_AGENT && (
            <Route path="/allocate-items" element={<PrivateRoute><AllocateItems /></PrivateRoute>} />
          )}

          {/* Client */}
          {currentUser?.role === ROLES.CLIENT && (
            <Route path="/track-orders" element={<PrivateRoute><TrackOrders /></PrivateRoute>} />
          )}

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      {/* ToastContainer renders notifications */}
      <ToastContainer />
    </Router>
  );
}
