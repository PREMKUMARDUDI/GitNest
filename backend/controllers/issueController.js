const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res) => {
  const { repoID } = req.params; // RepoID
  const { title, description, owner } = req.body;

  try {
    const existingIssue = await Issue.findOne({
      title: title.trim(),
      repository: repoID,
    });

    if (existingIssue) {
      return res.status(409).send({
        error: "Issue with this title already exists in this repository!",
      });
    }

    const newIssue = new Issue({
      title,
      description,
      owner,
      repository: repoID,
    });

    await newIssue.save();

    res.status(201).json(newIssue);
  } catch (err) {
    console.error("Error creating issue : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const updateIssueById = async (req, res) => {
  const { id } = req.params;
  const { description, status } = req.body;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      res.status(404).send({ error: "Issue not found!" });
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
  const { id } = req.params;
  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).send({ error: "Issue not found!" });
    }

    res
      .status(200)
      .json({ message: "Issue deleted successfully!", deletedIssue: issue });
  } catch (err) {
    console.error("Error deleting issue : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const getAllIssuesByRepo = async (req, res) => {
  const { repoID } = req.params; // RepoID

  try {
    const issues = await Issue.find({ repository: repoID }).populate(
      "repository",
    );

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
    const issues = await Issue.find({}).populate("repository");

    if (!issues || issues.length === 0) {
      return res.status(404).send({ error: "No Issues found!" });
    }

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error fetching issues : ", err.message);
    res.status(500).send("Internal Server Error!");
  }
};

const deleteAllIssuesByRepo = async (req, res) => {
  const { repoID } = req.params; // RepoID

  try {
    // Find all issues for the given repository
    const issues = await Issue.find({ repository: repoID });

    if (!issues || issues.length === 0) {
      return res
        .status(404)
        .send({ error: "No Issues found for this repository!" });
    }

    // Delete all issues in one go
    const deleteResult = await Issue.deleteMany({ repository: repoID });

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
    const issue = await Issue.findById(id)
      .populate("repository")
      .populate("owner");

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
  deleteAllIssuesByRepo,
  getIssueById,
};
