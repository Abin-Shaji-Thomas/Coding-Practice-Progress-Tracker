// Admin home page: short description of the site and three count cards.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getError } from "../../api";
import { useAuth } from "../../context/AuthContext";

function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  // Load the counts when the page opens
  useEffect(() => {
    api
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(getError(err)));
  }, []);

  // The three cards to show
  const cards = [
    { label: "Total Users", value: stats ? stats.totalUsers : "...", color: "primary" },
    { label: "Total Records", value: stats ? stats.totalRecords : "...", color: "secondary" },
    { label: "Solved Records", value: stats ? stats.solvedRecords : "...", color: "success" },
  ];

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p className="text-muted">
        The Coding Practice Progress Tracker helps students keep track of the coding problems
        they practise on platforms like LeetCode, HackerRank, CodeChef and Codeforces. As an
        admin you can add practice records, assign them to users, update their status and
        manage user accounts. Users can log in to see the problems assigned to them and their
        progress.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-md-4" key={c.label}>
            <div className={"card border-" + c.color + " shadow-sm"}>
              <div className="card-body text-center">
                <h6 className="text-muted">{c.label}</h6>
                <p className={"display-6 mb-0 text-" + c.color}>{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/admin/operations" className="btn btn-primary me-2 mb-2">Manage Records</Link>
      <Link to="/admin/users" className="btn btn-outline-primary mb-2">Manage Users</Link>
    </div>
  );
}

export default AdminHome;
