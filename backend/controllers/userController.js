const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const ObjectId = require("mongodb").ObjectId;

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

let client;

async function connectClient() {
  if (!client) {
    try {
      client = new MongoClient(mongoUrl);
      await client.connect();
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      throw err;
    }
  }
}

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);
    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "User created successfully!",
      token,
      user: {
        id: result.insertedId,
        username,
        email,
      },
    });
  } catch (err) {
    console.error("Error during singup : ", err.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
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
    res.status(500).json({ message: "Internal server error!" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users : ", err.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const getUserProfile = async (req, res) => {
  const currentUserID = req.params.id;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(currentUserID),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile : ", err.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const updateUserProfile = async (req, res) => {
  const currentUserID = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const updates = {};
    if (email) updates.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(currentUserID) },
      { $set: updates },
      { returnDocument: "after" }
    );

    let updatedUser = result.value;
    if (!updatedUser) {
      updatedUser = await usersCollection.findOne({
        _id: new ObjectId(currentUserID),
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found!" });
      }
    }

    res.send({
      updatedUser,
      message: "User Profile updated successfully!",
    });
  } catch (err) {
    console.error("Error updating user profile : ", err.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const deleteUserProfile = async (req, res) => {
  const currentUserID = req.params.id;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(currentUserID),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const result = await usersCollection.findOneAndDelete({
      _id: new ObjectId(currentUserID),
    });

    res.send({
      deletedUser: user,
      message: "User Profile deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting user profile : ", err.message);
    res.status(500).json({ message: "Internal server error!" });
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
