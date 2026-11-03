// Validation helpers used by the forms (same rules as the backend).

// Checks for something@something.something
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Returns an error message if the password is weak, or "" if it is strong.
export function passwordError(password) {
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain a special character";
  return "";
}

export const PASSWORD_HINT =
  "At least 8 characters with uppercase, lowercase, a number and a special character.";

// Dropdown options for records
export const PLATFORMS = ["LeetCode", "HackerRank", "CodeChef", "Codeforces", "Other"];
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];
export const STATUSES = ["Todo", "Attempted", "Solved"];
