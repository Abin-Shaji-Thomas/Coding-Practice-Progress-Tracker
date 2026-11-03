// User model: stores login details and the role (admin or user).
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // stored as a bcrypt hash
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("User", userSchema);
