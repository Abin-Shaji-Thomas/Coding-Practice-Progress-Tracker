// All the routes (pages) of the app.
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import AdminHome from "./pages/admin/AdminHome";
import Operations from "./pages/admin/Operations";
import UserManagement from "./pages/admin/UserManagement";
import Dashboard from "./pages/user/Dashboard";

function App() {
  const { user } = useAuth();

  // Where "/" should go depending on who is logged in
  let home = "/login";
  if (user) home = user.role === "admin" ? "/admin" : "/dashboard";

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to={home} replace />} />

          {/* Public pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Any logged-in user */}
          <Route
            path="/change-password"
            element={<ProtectedRoute><ChangePassword /></ProtectedRoute>}
          />

          {/* Admin pages */}
          <Route
            path="/admin"
            element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>}
          />
          <Route
            path="/admin/operations"
            element={<ProtectedRoute role="admin"><Operations /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>}
          />

          {/* Normal user page */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>}
          />

          {/* Unknown URL -> go home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
