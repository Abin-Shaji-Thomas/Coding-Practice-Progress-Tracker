// Simple validation helpers used by the routes.

// Checks for something@something.something
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Strong password: at least 8 characters with an uppercase letter,
// a lowercase letter, a number and a special character.
function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

// Allowed values for dropdown fields
const PLATFORMS = ["LeetCode", "HackerRank", "CodeChef", "Codeforces", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const STATUSES = ["Todo", "Attempted", "Solved"];
const ROLES = ["admin", "user"];

const PASSWORD_RULE =
  "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character";

module.exports = {
  isValidEmail,
  isStrongPassword,
  PLATFORMS,
  DIFFICULTIES,
  STATUSES,
  ROLES,
  PASSWORD_RULE,
};
