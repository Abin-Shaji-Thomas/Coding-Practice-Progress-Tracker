// User Management page: admin can view, add, update and remove users.
import { useEffect, useState } from "react";
import api, { getError } from "../../api";
import UserForm from "../../components/UserForm";
import { useAuth } from "../../context/AuthContext";

function UserManagement() {
  const { user: me } = useAuth(); // the logged-in admin
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadUsers() {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      setError(getError(err));
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function openAdd() {
    setEditing(null);
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function openEdit(u) {
    setEditing(u);
    setShowForm(true);
    setError("");
    setMessage("");
    window.scrollTo(0, 0);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleSave(data) {
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.put("/users/" + editing._id, {
          name: data.name,
          email: data.email,
          role: data.role,
        });
        setMessage("User updated successfully");
      } else {
        await api.post("/users", data);
        setMessage("User added successfully");
      }
      closeForm();
      loadUsers();
    } catch (err) {
      setError(getError(err));
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    setError("");
    setMessage("");
    try {
      await api.delete("/users/" + id);
      setMessage("User removed successfully");
      setConfirmId(null);
      loadUsers();
    } catch (err) {
      setError(getError(err));
      setConfirmId(null);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="mb-0">User Management</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={openAdd}>+ Add User</button>
        )}
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">{editing ? "Edit User" : "Add User"}</h5>
            <UserForm
              key={editing ? editing._id : "new"}
              initial={editing}
              onSubmit={handleSave}
              onCancel={closeForm}
              saving={saving}
            />
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    {u.name} {u._id === me.id && <span className="badge bg-info text-dark">You</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={"badge " + (u.role === "admin" ? "bg-primary" : "bg-secondary")}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="text-nowrap">
                    {confirmId === u._id ? (
                      <>
                        <span className="me-2">Remove?</span>
                        <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(u._id)}>Yes</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setConfirmId(null)}>No</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(u)}>Edit</button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setConfirmId(u._id)}
                          disabled={u._id === me.id}
                          title={u._id === me.id ? "You cannot delete your own account" : ""}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-muted small mt-2">
        Note: removing a user also removes the practice records assigned to them.
      </p>
    </div>
  );
}

export default UserManagement;
