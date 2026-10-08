const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res) => {
  const { repoID } = req.params; // RepoID
  const { title, description, owner } = req.body;

  try {
    const trimmedTitle = title ? title.trim() : "";

    const existingIssue = await Issue.findOne({
      title: trimmedTitle,
      repository: repoID,
    });

    if (existingIssue) {
      return res.status(409).send({
        error: "Issue with this title already exists in this repository!",
      });
    }

    const repository = await Repository.findById(repoID);
    if (!repository) {
      return res.status(404).send({ error: "Repository not found!" });
    }

    const newIssue = new Issue({
      title: trimmedTitle,
      description,
      owner,
      repository: repoID,
    });
    await newIssue.save();

    repository.issues.push(newIssue._id);
    await repository.save();

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
      return res.status(404).send({ error: "Issue not found!" });
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
  const { repoID } = req.params; // RepoID

  try {
    const issues = await Issue.find({ repository: repoID })
      .populate("repository", "name description owner")
      .populate("owner", "username email");

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
      .populate("owner", "username email");

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
  const { userID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).send("Invalid User ID!");
    }

    const issues = await Issue.find({ owner: userID })
      .populate("repository", "name description owner")
      .populate("owner", "username email");

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
    const issue = await Issue.findById(id)
      .populate("repository", "name description owner")
      .populate("owner", "username email");

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
