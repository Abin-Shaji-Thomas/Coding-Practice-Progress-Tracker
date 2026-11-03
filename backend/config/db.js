// Connects to MongoDB Atlas using Mongoose.
// The connection is cached so that on Vercel (serverless) we do not open
// a new connection on every single request.
const mongoose = require("mongoose");

let cached = null; // holds the connection promise once created

async function connectDB() {
  if (cached) return cached; // reuse the existing connection

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in the environment variables");
  }

  cached = mongoose.connect(process.env.MONGO_URI).catch((err) => {
    cached = null; // reset so the next request can try again
    throw err;
  });
  return cached;
}

module.exports = connectDB;
