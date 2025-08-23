import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./deleteRepo.css";

const DeleteRepo = () => {
  const { repoId } = useParams();
  const [repo, setRepo] = useState({});
  const [issues, setIssues] = useState([]);

  const [isDeleteWindowOpen, SetIsDeleteWindowOpen] = useState(true);

  const userId = localStorage.getItem("userId");

  const [isLoadingRepo, setIsLoadingRepo] = useState(true);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const res = await clientServer.get(`/repo/${repoId}`);
        setRepo(res.data);
        setIsLoadingRepo(false);
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

  useEffect(() => {
    if (repo.owner && repo.owner._id !== userId) {
      navigate(`/repo/${repoId}`);
    }
  }, [repo.owner, userId, repoId, navigate]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await clientServer.delete(`/repo/delete/${repoId}`);

      console.log("deleted Repo : ", res.data);
      navigate(`/`);
    } catch (err) {
      console.error("Error deleting repository : ", err);
    }
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
      <div
        className="RepoDelete_Container"
        onClick={() => {
          SetIsDeleteWindowOpen(false);
          navigate(`/repo/${repoId}`);
        }}
      >
        {isDeleteWindowOpen && (
          <div className="delete_Container">
            <div className="delete_Top">
              <div className="deleteRepo_Name">
                Delete {repo.owner?.username}/{repo.name}
              </div>
              <div
                className="deleteContainer_Collapse"
                onClick={() => {
                  SetIsDeleteWindowOpen(false);
                  navigate(`/repo/${repoId}`);
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

            <div className="delete_Body">
              <img src="/newRepo.png" alt="" />
              <div className="deleteRepo_Name2">
                Delete {repo.owner?.username}/{repo.name}
              </div>
            </div>

            <div className="deleteRepo_Btn" onClick={handleDelete}>
              <span>I want to delete this repository</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeleteRepo;
