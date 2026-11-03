// Normal user dashboard: view-only list of the records assigned to me,
// with search, filters and summary counts.
import { useEffect, useState } from "react";
import api, { getError } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { PLATFORMS, DIFFICULTIES, STATUSES } from "../../utils/validate";

function Dashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter values
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Load my records once when the page opens
  useEffect(() => {
    api
      .get("/records/mine")
      .then((res) => setRecords(res.data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, []);

  // Summary counts (for all my records)
  const total = records.length;
  const solved = records.filter((r) => r.status === "Solved").length;
  const attempted = records.filter((r) => r.status === "Attempted").length;
  const todo = records.filter((r) => r.status === "Todo").length;

  // Apply search and filters
  const shown = records.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) &&
      (platform === "" || r.platform === platform) &&
      (status === "" || r.status === status) &&
      (difficulty === "" || r.difficulty === difficulty)
  );

  function clearFilters() {
    setSearch("");
    setPlatform("");
    setStatus("");
    setDifficulty("");
  }

  const cards = [
    { label: "Total", value: total, color: "primary" },
    { label: "Solved", value: solved, color: "success" },
    { label: "Attempted", value: attempted, color: "warning" },
    { label: "Todo", value: todo, color: "secondary" },
  ];

  const statusColor = { Solved: "success", Attempted: "warning", Todo: "secondary" };

  return (
    <div>
      <h2>My Practice Records</h2>
      <p className="text-muted">Hi {user.name}, here are the problems assigned to you.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-6 col-md-3" key={c.label}>
            <div className={"card border-" + c.color + " shadow-sm"}>
              <div className="card-body text-center py-3">
                <h6 className="text-muted mb-1">{c.label}</h6>
                <p className={"fs-2 fw-bold mb-0 text-" + c.color}>{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="">All platforms</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="">All difficulties</option>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>Clear</button>
            </div>
          </div>
        </div>
      </div>

      {/* Records table (view only) */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Platform</th>
                <th>Topic</th>
                <th>Difficulty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              )}
              {!loading && shown.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    {records.length === 0 ? "No records have been assigned to you yet." : "No records match your search."}
                  </td>
                </tr>
              )}
              {shown.map((r) => (
                <tr key={r._id}>
                  <td>
                    {r.link ? (
                      <a href={r.link} target="_blank" rel="noreferrer">{r.title}</a>
                    ) : (
                      r.title
                    )}
                  </td>
                  <td>{r.platform}</td>
                  <td>{r.topic}</td>
                  <td>{r.difficulty}</td>
                  <td><span className={"badge bg-" + statusColor[r.status]}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-muted small mt-2">
        Showing {shown.length} of {total} records.
      </p>
    </div>
  );
}

export default Dashboard;
