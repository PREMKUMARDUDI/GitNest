const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res) => {
  const userId = req.user.id;
  const { repoID } = req.params;
  const { title, description } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoID)) {
      return res.status(400).json({ error: "Invalid Repository ID format!" });
    }

    const trimmedTitle = title ? title.trim() : "";
    if (!trimmedTitle) {
      return res.status(400).json({ error: "Issue title is required!" });
    }

    const existingIssue = await Issue.findOne({
      title: trimmedTitle,
      repository: repoID,
    });

    if (existingIssue) {
      return res.status(409).send({
        error: "Issue with this title already exists in this repository!",
      });
    }

    const repository = await Repository.findById(repoID).lean();
    if (!repository) {
      return res.status(404).send({ error: "Repository not found!" });
    }

    const newIssue = new Issue({
      title: trimmedTitle,
      description,
      owner: userId,
      repository: repoID,
    });
    await newIssue.save();

    await Repository.findByIdAndUpdate(repoID, {
      $push: { issues: newIssue._id },
    });

    res.status(201).json(newIssue);
  } catch (err) {
    console.error("Error creating issue : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const updateIssueById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { description, status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Issue ID format!" });
    }

    const issue = await Issue.findOne({ _id: id, owner: userId });
    if (!issue) {
      return res
        .status(404)
        .send({ error: "Issue not found or unauthorized!" });
    }

    if (description) issue.description = description;
    if (status) issue.status = status;
    await issue.save();

    res.status(200).json({ message: "Issue updated successfully!", issue });
  } catch (err) {
    console.error("Error updating issue : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const deleteIssueById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Issue ID format!" });
    }

    const issue = await Issue.findOneAndDelete({ _id: id, owner: userId });
    if (!issue) {
      return res
        .status(404)
        .send({ error: "Issue not found or unauthorized!" });
    }

    await Repository.findByIdAndUpdate(issue.repository, {
      $pull: { issues: id },
    });

    res
      .status(200)
      .json({ message: "Issue deleted successfully!", deletedIssue: issue });
  } catch (err) {
    console.error("Error deleting issue : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const getAllIssuesByRepo = async (req, res) => {
  const { repoID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoID)) {
      return res.status(400).json({ error: "Invalid Repository ID format!" });
    }

    const issues = await Issue.find({ repository: repoID })
      .populate("repository", "name description owner")
      .populate("owner", "username email")
      .lean();

    if (!issues || issues.length === 0) {
      return res
        .status(404)
        .send({ error: "No Issues found for this repository!" });
    }

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error fetching issues : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find({})
      .populate("repository", "name description owner")
      .populate("owner", "username email")
      .lean();

    if (!issues || issues.length === 0) {
      return res.status(404).send({ error: "No Issues found!" });
    }

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error fetching issues : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const getAllIssuesForCurrentUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const issues = await Issue.find({ owner: userId })
      .populate("repository", "name description owner")
      .populate("owner", "username email")
      .lean();

    if (!issues || issues.length === 0) {
      return res.status(404).send({ error: "No Issues found for this user!" });
    }

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error fetching issues for user: ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const deleteAllIssuesByRepo = async (req, res) => {
  const userId = req.user.id;
  const { repoID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoID)) {
      return res.status(400).json({ error: "Invalid Repository ID format!" });
    }

    const repo = await Repository.findOne({
      _id: repoID,
      owner: userId,
    }).lean();
    if (!repo) {
      return res
        .status(403)
        .json({ error: "Unauthorized or Repository not found!" });
    }

    // Delete all issues in one go
    const deleteResult = await Issue.deleteMany({
      repository: repoID,
    });

    await Repository.findByIdAndUpdate(repoID, {
      $set: { issues: [] },
    });

    return res.status(200).json({
      message: "All issues deleted successfully!",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting issues : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const getIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Issue ID format!" });
    }

    const issue = await Issue.findById(id)
      .populate("repository", "name description owner")
      .populate("owner", "username email")
      .lean();

    if (!issue) {
      return res.status(404).send({ error: "Issue not found!" });
    }

    res.status(200).json(issue);
  } catch (err) {
    console.error("Error fetching issue : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssuesByRepo,
  getAllIssues,
  getAllIssuesForCurrentUser,
  deleteAllIssuesByRepo,
  getIssueById,
};
