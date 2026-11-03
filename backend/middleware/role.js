// Allows the request to continue only if the logged-in user is an admin.
// Must be used after the auth middleware.
function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: admins only" });
}

module.exports = { adminOnly };
