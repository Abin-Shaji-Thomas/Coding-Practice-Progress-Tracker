// Record model: one coding practice problem assigned to a user.
const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    platform: {
      type: String,
      enum: ["LeetCode", "HackerRank", "CodeChef", "Codeforces", "Other"],
      required: true,
    },
    topic: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    status: { type: String, enum: ["Todo", "Attempted", "Solved"], default: "Todo" },
    link: { type: String, trim: true, default: "" }, // optional
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);
