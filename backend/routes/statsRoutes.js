// Dashboard counts for the admin home page.
const express = require("express");
const User = require("../models/User");
const Record = require("../models/Record");
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/role");

const router = express.Router();

// GET /api/stats - total users, total records, solved records (admin)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecords = await Record.countDocuments();
    const solvedRecords = await Record.countDocuments({ status: "Solved" });
    res.json({ totalUsers, totalRecords, solvedRecords });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
