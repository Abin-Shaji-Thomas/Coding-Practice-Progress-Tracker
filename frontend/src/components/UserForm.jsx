// Form used by the admin to add a user or edit a user's details.
// When editing, the password field is hidden (users change it themselves).
// Props: initial (user or null), onSubmit, onCancel, saving
import { useState } from "react";
import { isValidEmail, passwordError, PASSWORD_HINT } from "../utils/validate";

function UserForm({ initial, onSubmit, onCancel, saving }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    name: initial ? initial.name : "",
    email: initial ? initial.email : "",
    role: initial ? initial.role : "user",
    password: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!isValidEmail(form.email)) errs.email = "Please enter a valid email address";
    if (!form.role) errs.role = "Please select a role";
    if (!isEdit) {
      if (!form.password) errs.password = "Password is required";
      else if (passwordError(form.password)) errs.password = passwordError(form.password);
    }
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(form);
  }

  const cls = (base, field) => base + (errors[field] ? " is-invalid" : "");

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input name="name" className={cls("form-control", "name")} value={form.name} onChange={handleChange} />
          <div className="invalid-feedback">{errors.name}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input name="email" type="email" className={cls("form-control", "email")} value={form.email} onChange={handleChange} />
          <div className="invalid-feedback">{errors.email}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Role</label>
          <select name="role" className={cls("form-select", "role")} value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="invalid-feedback">{errors.role}</div>
        </div>

        {!isEdit && (
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className={cls("form-control", "password")}
              value={form.password}
              onChange={handleChange}
            />
            <div className="invalid-feedback">{errors.password}</div>
            <div className="form-text">{PASSWORD_HINT}</div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <button className="btn btn-primary me-2" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update User" : "Add User"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default UserForm;
