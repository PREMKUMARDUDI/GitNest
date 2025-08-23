import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./issueDetails.css";

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState({});
  const [repository, setRepository] = useState({});

  const userId = localStorage.getItem("userId");

  const [isLoadingIssue, setIsLoadingIssue] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSelectedIssue = async () => {
      try {
        const res = await clientServer.get(`/issue/${id}`);
        console.log(res);
        const data = res.data;
        setIssue(data);
        setRepository(data.repository);
        setIsLoadingIssue(false);
        console.log("selected Issue:", data);
      } catch (err) {
        console.error("Error fetching issue: ", err);
        setIsLoadingIssue(false);
      }
    };

    if (id) fetchSelectedIssue();
  }, [id]);

  const handleIssueUpdate = () => {
    navigate(`/issue/update/${issue._id}`);
  };

  const handleIssueDelete = () => {
    navigate(`/issue/delete/${issue._id}`);
  };

  // Show loading indicator while data is loading
  if (isLoadingIssue) {
    return (
      <div style={{ marginLeft: "2rem" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="IssueDetails_Container">
        <div className="issue_Top">
          <h2>{issue.title}</h2>
          <div className="status_Icon">
            {issue.status === "open" ? "Open" : "Closed"}
          </div>
        </div>

        <div className="issue_Repo">
          <span>Repository</span> :{" "}
          <span>{issue.repository?.name || "Unknown"}</span>
        </div>

        <div className="issue_Description">
          <span>Description</span>: <span>{issue.description}</span>
        </div>

        <div className="issue_Change_Navigates">
          {issue.repository?.owner === userId && (
            <div
              className="update_Issue"
              onClick={() => {
                handleIssueUpdate();
              }}
            >
              Update Issue
            </div>
          )}

          {issue.repository?.owner === userId && (
            <div
              className="delete_Issue"
              onClick={() => {
                handleIssueDelete();
              }}
            >
              Delete Issue
            </div>
          )}

          <div
            className="back"
            onClick={() => {
              navigate(`/repo/${repository._id}`);
            }}
          >
            Go Back
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueDetails;
