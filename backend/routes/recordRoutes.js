// Practice record routes.
// Admin: list all, add, update, delete. Normal user: GET /mine (view only).
const express = require("express");
const mongoose = require("mongoose");
const Record = require("../models/Record");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/role");
const { PLATFORMS, DIFFICULTIES, STATUSES } = require("../utils/validate");

const router = express.Router();

// Checks the record fields and returns an error message, or null if all good.
// allowAll = true lets assignedTo be "all" (only used when adding records).
async function validateRecord(body, allowAll) {
  const { title, platform, topic, difficulty, status, link, assignedTo } = body;

  if (!title || !platform || !topic || !difficulty || !status || !assignedTo) {
    return "Title, platform, topic, difficulty, status and assigned user are required";
  }
  if (!PLATFORMS.includes(platform)) return "Invalid platform";
  if (!DIFFICULTIES.includes(difficulty)) return "Invalid difficulty";
  if (!STATUSES.includes(status)) return "Invalid status";
  if (link && !/^https?:\/\/\S+$/.test(link)) {
    return "Link must start with http:// or https://";
  }
  if (allowAll && assignedTo === "all") return null; // checked later in the POST route
  if (!mongoose.isValidObjectId(assignedTo)) return "Invalid assigned user";

  const user = await User.findById(assignedTo);
  if (!user) return "Assigned user does not exist";

  return null;
}

// Picks only the allowed fields from the request body
function pickFields(body) {
  return {
    title: body.title.trim(),
    platform: body.platform,
    topic: body.topic.trim(),
    difficulty: body.difficulty,
    status: body.status,
    link: (body.link || "").trim(),
    assignedTo: body.assignedTo,
  };
}

// GET /api/records/mine - records assigned to the logged-in user (view only)
// Defined before the /:id routes so "mine" is not treated as an id.
router.get("/mine", auth, async (req, res) => {
  try {
    const records = await Record.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// GET /api/records - all records (admin)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const records = await Record.find()
      .populate("assignedTo", "name email") // include the user's name, not just the id
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// POST /api/records - add a record (admin)
// If assignedTo is "all", one separate copy is created for every normal user.
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const body = req.body || {};
    const error = await validateRecord(body, true);
    if (error) return res.status(400).json({ message: error });

    if (body.assignedTo === "all") {
      const users = await User.find({ role: "user" });
      if (users.length === 0) {
        return res.status(400).json({ message: "There are no normal users to assign to" });
      }
      // Build one record per user, each with its own status
      const docs = users.map((u) => ({ ...pickFields(body), assignedTo: u._id }));
      const records = await Record.insertMany(docs);
      return res.status(201).json({
        message: "Record added for " + records.length + " users",
        count: records.length,
      });
    }

    const record = await Record.create(pickFields(body));
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// PUT /api/records/:id/status - a normal user updates the status of their own record.
// Only the status field is used; every other field in the body is ignored.
router.put("/:id/status", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record id" });
    }
    const status = (req.body || {}).status;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: "Status must be Todo, Attempted or Solved" });
    }

    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    // Only the user the record is assigned to may change it
    if (record.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own records" });
    }

    record.status = status;
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// PUT /api/records/:id - update a record (admin)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record id" });
    }
    const body = req.body || {};
    const error = await validateRecord(body);
    if (error) return res.status(400).json({ message: error });

    const record = await Record.findByIdAndUpdate(req.params.id, pickFields(body), {
      returnDocument: "after",
      runValidators: true,
    });
    if (!record) return res.status(404).json({ message: "Record not found" });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// DELETE /api/records/:id - delete a record (admin)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record id" });
    }
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
