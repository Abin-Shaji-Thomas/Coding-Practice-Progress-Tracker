// Change password page (available to all logged-in users).
import { useState } from "react";
import api, { getError } from "../api";
import { passwordError, PASSWORD_HINT } from "../utils/validate";

function ChangePassword() {
  const empty = { oldPassword: "", newPassword: "", confirmPassword: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (!form.oldPassword) errs.oldPassword = "Old password is required";
    if (!form.newPassword) errs.newPassword = "New password is required";
    else if (passwordError(form.newPassword)) errs.newPassword = passwordError(form.newPassword);
    else if (form.newPassword === form.oldPassword)
      errs.newPassword = "New password must be different from the old one";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm the new password";
    else if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccess("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await api.put("/auth/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      setSuccess(res.data.message);
      setForm(empty); // clear the form
    } catch (err) {
      setServerError(getError(err));
    }
    setLoading(false);
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="mb-3">Change Password</h3>
            {success && <div className="alert alert-success">{success}</div>}
            {serverError && <div className="alert alert-danger">{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Old Password</label>
                <input
                  name="oldPassword"
                  type="password"
                  className={"form-control" + (errors.oldPassword ? " is-invalid" : "")}
                  value={form.oldPassword}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.oldPassword}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  className={"form-control" + (errors.newPassword ? " is-invalid" : "")}
                  value={form.newPassword}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.newPassword}</div>
                <div className="form-text">{PASSWORD_HINT}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  className={"form-control" + (errors.confirmPassword ? " is-invalid" : "")}
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              </div>

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Saving..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
