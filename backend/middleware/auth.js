// Checks that the request has a valid JWT token.
// Expected header: Authorization: Bearer <token>
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Please log in first" });
  }

  try {
    // The token contains the user's id and role
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired, please log in again" });
  }
}

module.exports = auth;
