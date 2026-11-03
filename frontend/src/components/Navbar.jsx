// Top navigation bar. Shows different links for admin and normal users.
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // mobile menu open or closed

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/login");
  }

  // Close the mobile menu after clicking a link
  const close = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={close}>
          Coding Tracker
        </Link>
        <button className="navbar-toggler" type="button" onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={open ? "collapse navbar-collapse show" : "collapse navbar-collapse"}>
          <ul className="navbar-nav me-auto">
            {user && user.role === "admin" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin" end onClick={close}>Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/operations" onClick={close}>Operations</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/users" onClick={close}>Users</NavLink>
                </li>
              </>
            )}
            {user && user.role === "user" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard" onClick={close}>Dashboard</NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav align-items-lg-center">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-lg-3">
                    {user.name} ({user.role})
                  </span>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/change-password" onClick={close}>Change Password</NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm my-2 my-lg-0 ms-lg-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login" onClick={close}>Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup" onClick={close}>Sign Up</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
