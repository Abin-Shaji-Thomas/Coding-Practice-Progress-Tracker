// User management routes (admin only): list, add, update and delete users.
const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Record = require("../models/Record");
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/role");
const { isValidEmail, isStrongPassword, ROLES, PASSWORD_RULE } = require("../utils/validate");

const router = express.Router();

// Every route in this file needs a logged-in admin
router.use(auth, adminOnly);

// GET /api/users - list all users (without passwords)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// POST /api/users - admin adds a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password and role are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: PASSWORD_RULE });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Role must be admin or user" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email, password: hashed, role });

    // Send the new user back without the password
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// PUT /api/users/:id - update name, email and role
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (!name || !email || !role) {
      return res.status(400).json({ message: "Name, email and role are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Role must be admin or user" });
    }
    if (id === req.user.id && role !== "admin") {
      return res.status(400).json({ message: "You cannot remove your own admin role" });
    }

    // Make sure no other user already has this email
    const sameEmail = await User.findOne({ email: email.toLowerCase(), _id: { $ne: id } });
    if (sameEmail) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name: name.trim(), email, role },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// DELETE /api/users/:id - remove a user and their records
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also remove the records that were assigned to this user
    await Record.deleteMany({ assignedTo: id });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
