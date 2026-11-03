// Seed script: creates the demo users and their practice records.
// Run with:  npm run seed   (from the backend folder)
//
// Safe to run more than once:
//  - a demo user is only created if their email does not exist yet
//  - their old records are deleted before the new ones are added
// The admin account is never touched.
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Record = require("./models/Record");

// Helpers that build the real problem URLs for each platform
const LC = (slug) => "https://leetcode.com/problems/" + slug + "/";
const HR = (slug) => "https://www.hackerrank.com/challenges/" + slug + "/problem";
const CF = (contest, index) => "https://codeforces.com/problemset/problem/" + contest + "/" + index;
const CC = (code) => "https://www.codechef.com/problems/" + code;

// Each record: [title, platform, topic, difficulty, status, link]
const demoUsers = [
  {
    name: "Demo User",
    email: "user@demo.com",
    password: "User@123",
    records: [
      ["Two Sum", "LeetCode", "Arrays, Hashing", "Easy", "Solved", LC("two-sum")],
      ["Valid Parentheses", "LeetCode", "Stack", "Easy", "Solved", LC("valid-parentheses")],
      ["Diagonal Difference", "HackerRank", "Matrices", "Easy", "Solved", HR("diagonal-difference")],
      ["Watermelon", "Codeforces", "Math", "Easy", "Solved", CF(4, "A")],
      ["Life, the Universe, and Everything", "CodeChef", "Basics", "Easy", "Solved", CC("TEST")],
      ["Longest Substring Without Repeating Characters", "LeetCode", "Sliding Window", "Medium", "Attempted", LC("longest-substring-without-repeating-characters")],
      ["New Year Chaos", "HackerRank", "Arrays", "Medium", "Attempted", HR("new-year-chaos")],
      ["Boredom", "Codeforces", "Dynamic Programming", "Medium", "Attempted", CF(455, "A")],
      ["Bytelandian gold coins", "CodeChef", "Dynamic Programming", "Medium", "Attempted", CC("COINS")],
      ["Merge k Sorted Lists", "LeetCode", "Heap, Linked List", "Hard", "Todo", LC("merge-k-sorted-lists")],
      ["Array Manipulation", "HackerRank", "Prefix Sums", "Hard", "Todo", HR("crush")],
      ["Ancient Berland Circus", "Codeforces", "Geometry", "Hard", "Todo", CF(1, "C")],
    ],
  },
  {
    name: "Demo User 2",
    email: "user2@demo.com",
    password: "User2@123",
    records: [
      ["Best Time to Buy and Sell Stock", "LeetCode", "Arrays", "Easy", "Solved", LC("best-time-to-buy-and-sell-stock")],
      ["Climbing Stairs", "LeetCode", "Dynamic Programming", "Easy", "Solved", LC("climbing-stairs")],
      ["Number of Islands", "LeetCode", "Graphs, BFS/DFS", "Medium", "Solved", LC("number-of-islands")],
      ["Coin Change", "LeetCode", "Dynamic Programming", "Medium", "Solved", LC("coin-change")],
      ["Mini-Max Sum", "HackerRank", "Arrays", "Easy", "Solved", HR("mini-max-sum")],
      ["Theatre Square", "Codeforces", "Math", "Easy", "Solved", CF(1, "A")],
      ["Lapindromes", "CodeChef", "Strings", "Easy", "Solved", CC("LAPIN")],
      ["Registration System", "Codeforces", "Hashing", "Medium", "Attempted", CF(4, "C")],
      ["Trapping Rain Water", "LeetCode", "Two Pointers", "Hard", "Attempted", LC("trapping-rain-water")],
      ["Median of Two Sorted Arrays", "LeetCode", "Binary Search", "Hard", "Todo", LC("median-of-two-sorted-arrays")],
    ],
  },
  {
    name: "Demo User 3",
    email: "user3@demo.com",
    password: "User3@123",
    records: [
      ["Simple Array Sum", "HackerRank", "Basics", "Easy", "Solved", HR("simple-array-sum")],
      ["Way Too Long Words", "Codeforces", "Strings", "Easy", "Solved", CF(71, "A")],
      ["Reverse Linked List", "LeetCode", "Linked List", "Easy", "Attempted", LC("reverse-linked-list")],
      ["ATM", "CodeChef", "Basics", "Easy", "Attempted", CC("HS08TEST")],
      ["Small factorials", "CodeChef", "Big Numbers", "Medium", "Attempted", CC("FCTRL2")],
      ["Maximum Subarray", "LeetCode", "Dynamic Programming", "Medium", "Todo", LC("maximum-subarray")],
      ["3Sum", "LeetCode", "Two Pointers", "Medium", "Todo", LC("3sum")],
      ["Climbing the Leaderboard", "HackerRank", "Binary Search", "Medium", "Todo", HR("climbing-the-leaderboard")],
      ["Sums in a Triangle", "CodeChef", "Dynamic Programming", "Medium", "Todo", CC("SUMTRIAN")],
      ["Binary Tree Maximum Path Sum", "LeetCode", "Trees", "Hard", "Todo", LC("binary-tree-maximum-path-sum")],
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  for (const demo of demoUsers) {
    // Find the user, or create them if they do not exist yet
    let user = await User.findOne({ email: demo.email });
    if (!user) {
      const hashed = await bcrypt.hash(demo.password, 10);
      user = await User.create({ name: demo.name, email: demo.email, password: hashed, role: "user" });
      console.log("Created user " + demo.email);
    } else {
      console.log("User already exists: " + demo.email);
    }

    // Replace this user's records with the seed list
    await Record.deleteMany({ assignedTo: user._id });
    const docs = demo.records.map(([title, platform, topic, difficulty, status, link]) => ({
      title, platform, topic, difficulty, status, link, assignedTo: user._id,
    }));
    await Record.insertMany(docs);
    console.log("Added " + docs.length + " records for " + demo.email);
  }

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch(async (err) => {
  console.error("Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
