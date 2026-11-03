// Sign-up page with form validation.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getError } from "../api";
import { isValidEmail, passwordError, PASSWORD_HINT } from "../utils/validate";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({}); // error message for each field
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update the form state when the user types
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Check every field and return an object of error messages
  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!isValidEmail(form.email)) errs.email = "Please enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    else if (passwordError(form.password)) errs.password = passwordError(form.password);
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!form.role) errs.role = "Please select a role";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return; // stop if there are errors

    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      navigate("/login", { state: { message: "Account created. Please log in." } });
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
            <h3 className="mb-3">Sign Up</h3>
            {serverError && <div className="alert alert-danger">{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className={"form-control" + (errors.name ? " is-invalid" : "")}
                  value={form.name}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.name}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className={"form-control" + (errors.email ? " is-invalid" : "")}
                  value={form.email}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className={"form-control" + (errors.password ? " is-invalid" : "")}
                  value={form.password}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.password}</div>
                <div className="form-text">{PASSWORD_HINT}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  className={"form-control" + (errors.confirmPassword ? " is-invalid" : "")}
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  className={"form-select" + (errors.role ? " is-invalid" : "")}
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="">-- Select role --</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <div className="invalid-feedback">{errors.role}</div>
              </div>

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-3 mb-0 text-center">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
