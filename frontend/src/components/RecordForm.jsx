// Form used by the admin to add or edit a practice record.
// Props:
//   initial  - the record being edited (or null when adding)
//   users    - list of users the record can be assigned to
//   onSubmit - function called with the form data when it is valid
//   onCancel - function called when the Cancel button is clicked
//   saving   - true while the request is running
import { useState } from "react";
import { PLATFORMS, DIFFICULTIES, STATUSES } from "../utils/validate";

function RecordForm({ initial, users, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({
    title: initial ? initial.title : "",
    platform: initial ? initial.platform : "",
    topic: initial ? initial.topic : "",
    difficulty: initial ? initial.difficulty : "",
    status: initial ? initial.status : "Todo",
    link: initial ? initial.link : "",
    // assignedTo may be a populated object { _id, name } or just an id
    assignedTo: initial && initial.assignedTo ? initial.assignedTo._id || initial.assignedTo : "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.platform) errs.platform = "Please select a platform";
    if (!form.topic.trim()) errs.topic = "Topic is required";
    if (!form.difficulty) errs.difficulty = "Please select a difficulty";
    if (!form.status) errs.status = "Please select a status";
    if (form.link && !/^https?:\/\/\S+$/.test(form.link))
      errs.link = "Link must start with http:// or https://";
    if (!form.assignedTo) errs.assignedTo = "Please choose a user";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(form);
  }

  // Small helper for the CSS class of each input
  const cls = (base, field) => base + (errors[field] ? " is-invalid" : "");

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input name="title" className={cls("form-control", "title")} value={form.title} onChange={handleChange} />
          <div className="invalid-feedback">{errors.title}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Topic</label>
          <input
            name="topic"
            placeholder="e.g. Arrays, DP, Graphs"
            className={cls("form-control", "topic")}
            value={form.topic}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.topic}</div>
        </div>

        <div className="col-md-4">
          <label className="form-label">Platform</label>
          <select name="platform" className={cls("form-select", "platform")} value={form.platform} onChange={handleChange}>
            <option value="">-- Select --</option>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="invalid-feedback">{errors.platform}</div>
        </div>

        <div className="col-md-4">
          <label className="form-label">Difficulty</label>
          <select name="difficulty" className={cls("form-select", "difficulty")} value={form.difficulty} onChange={handleChange}>
            <option value="">-- Select --</option>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="invalid-feedback">{errors.difficulty}</div>
        </div>

        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select name="status" className={cls("form-select", "status")} value={form.status} onChange={handleChange}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="invalid-feedback">{errors.status}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Link (optional)</label>
          <input
            name="link"
            placeholder="https://..."
            className={cls("form-control", "link")}
            value={form.link}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.link}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Assign To</label>
          <select name="assignedTo" className={cls("form-select", "assignedTo")} value={form.assignedTo} onChange={handleChange}>
            <option value="">-- Select user --</option>
            {/* "All users" creates one copy per user, so it is only offered when adding */}
            {!initial && <option value="all">All users</option>}
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.assignedTo}</div>
        </div>
      </div>

      <div className="mt-3">
        <button className="btn btn-primary me-2" disabled={saving}>
          {saving ? "Saving..." : initial ? "Update Record" : "Add Record"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default RecordForm;
