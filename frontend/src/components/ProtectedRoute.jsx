// Protects a page so only logged-in users with the right role can open it.
// Usage: <ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  // Not logged in -> go to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role -> send them to their own home page
  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}

export default ProtectedRoute;
