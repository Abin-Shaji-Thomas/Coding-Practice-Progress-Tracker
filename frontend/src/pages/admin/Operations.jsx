// Operations page: admin can view, filter, add, edit and delete practice records.
import { useEffect, useState } from "react";
import api, { getError } from "../../api";
import RecordForm from "../../components/RecordForm";

function Operations() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // record being edited, or null
  const [confirmId, setConfirmId] = useState(null); // record waiting for delete confirmation
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Table filters
  const [filterUser, setFilterUser] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Load records and users from the backend
  async function loadData() {
    try {
      const [recRes, userRes] = await Promise.all([api.get("/records"), api.get("/users")]);
      setRecords(recRes.data);
      // Records are assigned to normal users only
      setUsers(userRes.data.filter((u) => u.role === "user"));
    } catch (err) {
      setError(getError(err));
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAdd() {
    setEditing(null);
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function openEdit(record) {
    setEditing(record);
    setShowForm(true);
    setError("");
    setMessage("");
    window.scrollTo(0, 0);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  // Called by RecordForm with valid data
  async function handleSave(data) {
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.put("/records/" + editing._id, data);
        setMessage("Record updated successfully");
      } else {
        const res = await api.post("/records", data);
        // For "All users" the backend tells us how many copies were made
        setMessage(res.data.message || "Record added successfully");
      }
      closeForm();
      loadData();
    } catch (err) {
      setError(getError(err));
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    setError("");
    setMessage("");
    try {
      await api.delete("/records/" + id);
      setMessage("Record deleted successfully");
      setConfirmId(null);
      loadData();
    } catch (err) {
      setError(getError(err));
    }
  }

  // Bootstrap badge colour for each status
  const statusColor = { Solved: "success", Attempted: "warning", Todo: "secondary" };

  // Records shown in the table after applying the filters
  const shown = records.filter(
    (r) =>
      (filterUser === "" || (r.assignedTo && r.assignedTo._id === filterUser)) &&
      (filterStatus === "" || r.status === filterStatus)
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="mb-0">Practice Records</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={openAdd}>+ Add Record</button>
        )}
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">{editing ? "Edit Record" : "Add Record"}</h5>
            {users.length === 0 && (
              <div className="alert alert-warning">
                There are no normal users yet. Add a user first on the Users page.
              </div>
            )}
            <RecordForm
              key={editing ? editing._id : "new"}
              initial={editing}
              users={users}
              onSubmit={handleSave}
              onCancel={closeForm}
              saving={saving}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="row g-2 mb-3">
        <div className="col-sm-5 col-md-4">
          <select className="form-select" value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
            <option value="">All users</option>
            {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </div>
        <div className="col-sm-4 col-md-3">
          <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Todo">Todo</option>
            <option value="Attempted">Attempted</option>
            <option value="Solved">Solved</option>
          </select>
        </div>
        <div className="col-sm-3 col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => { setFilterUser(""); setFilterStatus(""); }}
          >
            Clear
          </button>
        </div>
        <div className="col-md-3 align-self-center text-muted small">
          Showing {shown.length} of {records.length} records
        </div>
      </div>

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
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    {records.length === 0 ? "No records yet." : "No records match the filters."}
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
                  <td>
                    <span className={"badge bg-" + statusColor[r.status]}>{r.status}</span>
                  </td>
                  <td>{r.assignedTo ? r.assignedTo.name : "-"}</td>
                  <td className="text-nowrap">
                    {confirmId === r._id ? (
                      <>
                        <span className="me-2">Delete?</span>
                        <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(r._id)}>Yes</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setConfirmId(null)}>No</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(r)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmId(r._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Operations;
