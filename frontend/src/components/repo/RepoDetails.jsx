import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./repoDetails.css";

const RepoDetails = () => {
  const { repoId } = useParams();
  const [repo, setRepo] = useState({});
  const [issues, setIssues] = useState([]);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [isLoadingRepo, setIsLoadingRepo] = useState(true);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const res = await clientServer.get(`/repo/${repoId}`);
        setRepo(res.data);
        setIsLoadingRepo(false);
        console.log("repository : ", res.data);
      } catch (err) {
        console.error("Error fetching repository details : ", err);
        setIsLoadingRepo(false);
      }
    };

    const fetchIssues = async () => {
      try {
        const res = await clientServer.get(`/issue/all/${repoId}`);
        setIssues(res.data);
        setIsLoadingIssues(false);
        console.log("repository issues : ", res.data);
      } catch (err) {
        console.error("Error fetching repository issues : ", err);
        setIsLoadingIssues(false);
      }
    };

    if (repoId) {
      fetchRepository();
      fetchIssues();
    }
  }, [repoId]);

  // Memoize filtered issues
  const filteredIssues = useMemo(() => issues, [issues]);

  const handleUpdate = () => {
    navigate(`/repo/update/${repo._id}`);
  };

  const handleDelete = () => {
    navigate(`/repo/delete/${repo._id}`);
  };

  // Show loading indicator while data is loading
  if (isLoadingRepo || isLoadingIssues) {
    return (
      <div style={{ marginLeft: "2rem" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="RepoDetails_Container">
        <div className="repo_Top">
          <h2>{repo.name}</h2>
          <div className="visibility_Icon">
            {repo.visibility ? "Public" : "Private"}
          </div>
        </div>

        <div className="repo_Owner">
          <span>Owner</span> : <span>{repo.owner?.username || "Unknown"}</span>
        </div>

        <div className="repo_Description">
          <span>Description</span>: <span>{repo.description}</span>
        </div>

        {filteredIssues.length !== 0 && (
          <div className="repo_IssueList">
            <span>Issues :</span>
            {filteredIssues.map((issue) => {
              return (
                <div
                  key={issue._id}
                  className="repo_IssueItem"
                  onClick={() => {
                    navigate(`/issue/${issue._id}`);
                  }}
                >
                  <img src="/newIssue.png" alt="" />
                  <span>{issue.title}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="repo_Change_Navigates">
          {repo.owner?._id === userId && (
            <div className="update_Repo" onClick={handleUpdate}>
              Update Repository
            </div>
          )}

          {repo.owner?._id === userId && (
            <div className="delete_Repo" onClick={handleDelete}>
              Delete Repository
            </div>
          )}

          <div
            className="back_Home"
            onClick={() => {
              navigate(`/`);
            }}
          >
            Go Back
          </div>
        </div>
      </div>
    </>
  );
};

export default RepoDetails;
