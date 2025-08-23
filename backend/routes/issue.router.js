const express = require("express");
const issueController = require("../controllers/issueController");
const issueRouter = express.Router();

issueRouter.post("/issue/create/:repoID", issueController.createIssue);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);
issueRouter.get("/issue/all/:repoID", issueController.getAllIssues);
issueRouter.delete(
  "/issue/delete/all/:repoID",
  issueController.deleteAllIssuesByRepo
);
issueRouter.get("/issue/:id", issueController.getIssueById);

module.exports = issueRouter;
