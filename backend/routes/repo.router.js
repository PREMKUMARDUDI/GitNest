const express = require("express");
const repoController = require("../controllers/repoController");
const protect = require("../middleware/authMiddleware");
const repoRouter = express.Router();

repoRouter.post("/repo/create", protect, repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get(
  "/repo/user",
  protect,
  repoController.fetchRepositoriesForCurrentUser,
);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.put(
  "/repo/update/:id",
  protect,
  repoController.updateRepositoryById,
);
repoRouter.delete(
  "/repo/delete/:id",
  protect,
  repoController.deleteRepositoryById,
);
repoRouter.patch(
  "/repo/toggle/:id",
  protect,
  repoController.toggleVisibilityById,
);

module.exports = repoRouter;
