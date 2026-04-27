const User = require("../models/User");

// GET /api/users  — all users except self
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { getUsers, getMe };
