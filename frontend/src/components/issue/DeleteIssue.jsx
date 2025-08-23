import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./deleteIssue.css";

const DeleteIssue = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState({});
  const [repository, setRepository] = useState({});

  const [isDeleteIssueWindowOpen, SetIsDeleteIssueWindowOpen] = useState(true);

  const userId = localStorage.getItem("userId");

  const [isLoadingIssue, setIsLoadingIssue] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await clientServer.get(`/issue/${id}`);
        console.log(res);
        const data = res.data;
        setIssue(data);
        setIsLoadingIssue(false);
        setRepository(data.repository);
        console.log("selected Issue:", data);
      } catch (err) {
        console.error("Error fetching issue : ", err);
        setIsLoadingIssue(false);
      }
    };

    if (id) fetchIssue();
  }, [id]);

  useEffect(() => {
    if (issue.repository && issue.repository.owner !== userId) {
      navigate(`/issue/${id}`);
    }
  }, [issue.repository, userId, id, navigate]);

  const handleIssueDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await clientServer.delete(`/issue/delete/${id}`);

      console.log("deleted Issue : ", res.data);
      navigate(`/repo/${repository._id}`);
    } catch (err) {
      console.error("Error deleting issue : ", err);
    }
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
      <div
        className="issueDelete_Container"
        onClick={() => {
          SetIsDeleteIssueWindowOpen(false);
          navigate(`/issue/${id}`);
        }}
      >
        {isDeleteIssueWindowOpen && (
          <div className="deleteIssue_Container">
            <div className="deleteIssue_Top">
              <div className="deleteIssue_Name">
                Delete {repository.name}/{issue.title}
              </div>
              <div
                className="deleteIssueContainer_Collapse"
                onClick={() => {
                  SetIsDeleteIssueWindowOpen(false);
                  navigate(`/issue/${id}`);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                  style={{ width: "1.2rem", height: "1.2rem" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <div className="deleteIssue_Body">
              <img src="/newIssue.png" alt="" />
              <div className="deleteIssue_Name2">
                Delete {repository.name}/{issue.title}
              </div>
            </div>

            <div className="deleteIssue_Btn" onClick={handleIssueDelete}>
              <span>I want to delete this issue</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeleteIssue;
