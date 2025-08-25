const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");

const createRepository = async (req, res) => {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).send("Repository name is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).send("Invalid User ID!");
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();
    res.status(201).send({
      message: "Repository created successfully!",
      repository: result,
    });
  } catch (err) {
    console.error("Error creating repository : ", err.message);
    res.status(500).send("Internal Server Error");
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res
      .status(200)
      .json({ message: "Repositories fetched successfully!", repositories });
  } catch (err) {
    console.error("Error fetching repositories: ", err.message);
    res.status(500).send("Internal Server Error");
  }
};

const fetchRepositoryById = async (req, res) => {
  const { id } = req.params;

  // Validate id format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid repository ID format" });
  }

  try {
    const repository = await Repository.findById(id)
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).send("Repository not found!");
    }

    res.status(200).json(repository);
  } catch (err) {
    console.error("Error fetching repository : ", err.message);
    return res.status(500).send("Internal Server Error");
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { name } = req.params;

  try {
    const repository = await Repository.findOne({ name })
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).send("Repository not found!");
    }

    res.status(200).json(repository);
  } catch (err) {
    console.error("Error fetching repository : ", err.message);
    return res.status(500).send("Internal Server Error");
  }
};

const fetchRepositoriesForCurrentUser = async (req, res) => {
  const { userID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).send("Invalid User ID!");
    }

    const repositories = await Repository.find({ owner: userID })
      .populate("owner")
      .populate("issues");

    if (!repositories || repositories.length === 0) {
      return res
        .status(404)
        .send({ error: "No repositories found for this user!" });
    }

    res
      .status(200)
      .json({ message: "Repositories fetched successfully!", repositories });
  } catch (err) {
    console.error("Error fetching repositories for user: ", err.message);
    res.status(500).send("Internal Server Error");
  }
};

const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { name, content, description, visibility } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).send("Repository not found!");
    }

    if (content) repository.content.push(content);
    if (description) repository.description = description;
    if (visibility !== undefined) {
      repository.visibility = visibility;
    }

    const updatedRepository = await repository.save();

    res.status(200).json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error updating repository : ", err.message);
    res.status(500).send("Internal Server Error");
  }
};

const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Check if the repo exists FIRST
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).send("Repository not found!");
    }

    // 2. If found, delete all issues associated with it
    const deletedIssuesResult = await Issue.deleteMany({ repository: id });

    // 3. Now delete the repository itself
    const deletedRepository = await Repository.findByIdAndDelete(id);

    res.status(200).json({
      message: "Repository and its issues deleted successfully!",
      deletedRepository,
      deletedIssuesCount: deletedIssuesResult.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting repository or its issues: ", err.message);
    res.status(500).send("Internal Server Error");
  }
};

const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).send("Repository not found!");
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.status(200).json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error toggling repository visibility: ", err.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
  toggleVisibilityById,
};
