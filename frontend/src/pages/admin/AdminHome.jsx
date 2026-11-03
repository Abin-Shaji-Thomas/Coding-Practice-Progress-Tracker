// Admin home page: short description of the site, three count cards
// and a "Progress per user" table.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getError } from "../../api";
import { useAuth } from "../../context/AuthContext";

function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  // Load the counts, users and records when the page opens
  useEffect(() => {
    Promise.all([api.get("/stats"), api.get("/users"), api.get("/records")])
      .then(([statsRes, usersRes, recordsRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data.filter((u) => u.role === "user"));
        setRecords(recordsRes.data);
      })
      .catch((err) => setError(getError(err)));
  }, []);

  // The three cards to show
  const cards = [
    { label: "Total Users", value: stats ? stats.totalUsers : "...", color: "primary" },
    { label: "Total Records", value: stats ? stats.totalRecords : "...", color: "secondary" },
    { label: "Solved Records", value: stats ? stats.solvedRecords : "...", color: "success" },
  ];

  // Build one row per normal user by counting their records
  const progress = users.map((u) => {
    const mine = records.filter((r) => r.assignedTo && r.assignedTo._id === u._id);
    return {
      id: u._id,
      name: u.name,
      total: mine.length,
      solved: mine.filter((r) => r.status === "Solved").length,
      attempted: mine.filter((r) => r.status === "Attempted").length,
      todo: mine.filter((r) => r.status === "Todo").length,
    };
  });

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p className="text-muted">
        The Coding Practice Progress Tracker helps students keep track of the coding problems
        they practise on platforms like LeetCode, HackerRank, CodeChef and Codeforces. As an
        admin you can add practice records, assign them to one user or to all users, and manage
        user accounts. Users log in to see the problems assigned to them and update their own
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

      <h4>Progress per user</h4>
      <div className="card shadow-sm mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Total</th>
                <th>Solved</th>
                <th>Attempted</th>
                <th>Todo</th>
              </tr>
            </thead>
            <tbody>
              {progress.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No users yet.</td>
                </tr>
              )}
              {progress.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.total}</td>
                  <td className="text-success fw-bold">{p.solved}</td>
                  <td className="text-warning fw-bold">{p.attempted}</td>
                  <td className="text-secondary fw-bold">{p.todo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link to="/admin/operations" className="btn btn-primary me-2 mb-2">Manage Records</Link>
      <Link to="/admin/users" className="btn btn-outline-primary mb-2">Manage Users</Link>
    </div>
  );
}

export default AdminHome;
