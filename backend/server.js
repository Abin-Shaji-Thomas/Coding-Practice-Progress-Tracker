// Main entry point of the backend.
// Sets up Express, CORS, JSON parsing, the database connection and all routes.
require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Allow requests only from our frontend (CLIENT_URL)
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Health check route, useful to see if the API is running
app.get("/", (req, res) => {
  res.json({ message: "Coding Practice Progress Tracker API is running" });
});

// Make sure the database is connected before any /api request
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    res.status(500).json({ message: "Could not connect to the database" });
  }
});

// Health check that also tests the database connection
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: "connected" });
});

// API routes
app.use("/api/auth", require("./routes/authRoutes"));

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server only when this file is run directly (node server.js).
// On Vercel the app is imported instead, so we just export it.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
