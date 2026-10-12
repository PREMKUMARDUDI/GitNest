const express = require("express");
const issueController = require("../controllers/issueController");
const protect = require("../middleware/authMiddleware");
const issueRouter = express.Router();

issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.get(
  "/issue/user",
  protect,
  issueController.getAllIssuesForCurrentUser,
);
issueRouter.post("/issue/create/:repoID", protect, issueController.createIssue);
issueRouter.put("/issue/update/:id", protect, issueController.updateIssueById);
issueRouter.delete(
  "/issue/delete/:id",
  protect,
  issueController.deleteIssueById,
);
issueRouter.get("/issue/all/:repoID", issueController.getAllIssuesByRepo);
issueRouter.delete(
  "/issue/delete/all/:repoID",
  protect,
  issueController.deleteAllIssuesByRepo,
);
issueRouter.get("/issue/:id", issueController.getIssueById);

module.exports = issueRouter;
