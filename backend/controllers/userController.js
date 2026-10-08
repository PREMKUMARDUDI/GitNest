const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const trimmedUsername = username ? username.trim() : "";
    const trimmedEmail = email ? email.trim() : "";

    if (!trimmedUsername || !trimmedEmail || !password) {
      return res.status(400).send({ error: "All credentials are required!" });
    }

    const userExists = await User.findOne({
      $or: [{ username: trimmedUsername }, { email: trimmedEmail }],
    });

    if (userExists) {
      return res
        .status(400)
        .send({ error: "User with this username or email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
      repositories: [],
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User created successfully!",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const trimmedEmail = email ? email.trim() : "";

    if (!trimmedEmail || !password) {
      return res
        .status(400)
        .send({ error: "Email and password are required!" });
    }

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).send({ error: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    if (!users || users.length === 0) {
      return res.status(404).send({ error: "No users found!" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const getUserProfile = async (req, res) => {
  const currentUserID = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(currentUserID)) {
      return res.status(400).send({ error: "Invalid User ID!" });
    }

    const user = await User.findById(currentUserID).select("-password");

    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const updateUserProfile = async (req, res) => {
  const currentUserID = req.params.id;
  const { email, password } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(currentUserID)) {
      return res.status(400).send({ error: "Invalid User ID!" });
    }

    const user = await User.findById(currentUserID);
    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    if (email) user.email = email.trim();
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();

    // Hide password before returning update payload
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "User Profile updated successfully!",
      updatedUser: userResponse,
    });
  } catch (err) {
    console.error("Error updating user profile : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const deleteUserProfile = async (req, res) => {
  const currentUserID = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(currentUserID)) {
      return res.status(400).send({ error: "Invalid User ID!" });
    }

    const user = await User.findById(currentUserID);
    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    // SYNC: Find all repositories owned by this user
    const userRepos = await Repository.find({ owner: currentUserID });
    const repoIds = userRepos.map((repo) => repo._id);

    // SYNC: Clean out all issues related to any of this user's repositories
    await Issue.deleteMany({ repository: { $in: repoIds } });

    // SYNC: Clean out any direct issues this specific user authored elsewhere
    await Issue.deleteMany({ owner: currentUserID });

    // SYNC: Safely remove all repositories owned by this user
    await Repository.deleteMany({ owner: currentUserID });

    // Finally, delete the user account
    await User.findByIdAndDelete(currentUserID);

    res.status(200).json({
      message:
        "User account and all associated resources deleted successfully!",
      deletedUser: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error deleting user profile : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
