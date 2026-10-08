const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createRepository = async (req, res) => {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    const trimmedName = name ? name.trim() : "";

    if (!trimmedName) {
      return res.status(400).send({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).send({ error: "Invalid User ID!" });
    }

    const user = await User.findById(owner);
    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    const newRepository = new Repository({
      name: trimmedName,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    user.repositories.push(result._id);
    await user.save();

    res.status(201).json({
      message: "Repository created successfully!",
      repository: result,
    });
  } catch (err) {
    console.error("Error creating repository : ", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({}).populate(
      "owner",
      "username email",
    );

    if (!repositories || repositories.length === 0) {
      return res.status(404).send({ error: "No repositories found!" });
    }

    res
      .status(200)
      .json({ message: "Repositories fetched successfully!", repositories });
  } catch (err) {
    console.error("Error fetching repositories: ", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const fetchRepositoryById = async (req, res) => {
  const { id } = req.params;

  // Validate id format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid repository ID format" });
  }

  try {
    const repository = await Repository.findById(id).populate(
      "owner",
      "username email",
    );

    if (!repository) {
      return res.status(404).send({ error: "Repository not found!" });
    }

    res.status(200).json(repository);
  } catch (err) {
    console.error("Error fetching repository : ", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { name } = req.params;

  try {
    const repository = await Repository.findOne({ name }).populate(
      "owner",
      "username email",
    );

    if (!repository) {
      return res.status(404).send({ error: "Repository not found!" });
    }

    res.status(200).json(repository);
  } catch (err) {
    console.error("Error fetching repository : ", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const fetchRepositoriesForCurrentUser = async (req, res) => {
  const { userID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).send({ error: "Invalid User ID!" });
    }

    const repositories = await Repository.find({ owner: userID }).populate(
      "owner",
      "username email",
    );

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
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { name, content, description, visibility } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Repository ID!" });
    }

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).send({ error: "Repository not found!" });
    }

    if (name) repository.name = name.trim();
    if (description) repository.description = description;
    if (visibility !== undefined) {
      repository.visibility = visibility;
    }
    if (content) {
      if (Array.isArray(content)) {
        repository.content = [...repository.content, ...content];
      } else {
        repository.content.push(content);
      }
    }

    await repository.save();

    res.status(200).json({
      message: "Repository updated successfully!",
      repository,
    });
  } catch (err) {
    console.error("Error updating repository : ", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Repository ID!" });
    }

    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).send({ error: "Repository not found!" });
    }

    const deletedIssuesResult = await Issue.deleteMany({ repository: id });

    await User.findByIdAndUpdate(repository.owner, {
      $pull: { repositories: id },
    });

    const deletedRepository = await Repository.findByIdAndDelete(id);

    res.status(200).json({
      message: "Repository and its issues deleted successfully!",
      deletedRepository,
      deletedIssuesCount: deletedIssuesResult.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting repository or its issues: ", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Repository ID!" });
    }

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).send({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    await repository.save();

    res.status(200).json({
      message: "Repository visibility toggled successfully!",
      repository,
    });
  } catch (err) {
    console.error("Error toggling repository visibility: ", err.message);
    res.status(500).send({ error: "Internal Server Error" });
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
