import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientServer } from "../../serverConfig";
import "./newIssue.css";
import Navbar from "../Navbar";

const NewIssue = () => {
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(true);
  const [repositories, setRepositories] = useState([]);
  const [userProfile, setUserProfile] = useState("");
  const [isRepoListOpen, setIsRepoListOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState({});

  const [isLoadingRepos, setIsLoadingRepos] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchUserProfile = async () => {
      try {
        const res = await clientServer.get(`/userProfile/${userId}`);

        const data = res.data;
        setUserProfile(data);
        console.log("currUser : ", data);
      } catch (err) {
        console.error("Error fetching User Profile : ", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const res = await clientServer.get(`/repo/user/${userId}`);

        const data = res.data;
        setRepositories(data.repositories.reverse());
        setIsLoadingRepos(false);
        setSelectedRepo(data.repositories[0]);
        console.log("currUser Repos:", data.repositories);
      } catch (err) {
        console.error("Error fetching repositories : ", err);
        setIsLoadingRepos(false);
      }
    };

    fetchRepositories();
  }, []);

  if (isLoadingRepos) {
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
        className="newIssue_OuterContainer"
        onClick={() => {
          setIsNewIssueOpen(false);
          navigate("/");
        }}
      >
        {isNewIssueOpen && (
          <div
            className="newIssue_Container"
            onClick={(e) => {
              e.stopPropagation();
              setIsRepoListOpen(false);
            }}
          >
            <div className="newIssue_Top">
              <div className="newIssue_Name">Create new issue</div>
              <div
                className="newIssue_Collapse"
                onClick={() => {
                  setIsNewIssueOpen(false);
                  navigate(`/`);
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

            <div className="newIssue_Body">
              <span>
                Repository <span>*</span>
              </span>
              <div
                className="repo_Dropdown"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRepoListOpen(!isRepoListOpen);
                }}
              >
                <img src="/newRepo.png" alt="" />
                <span>
                  {userProfile.username}/{selectedRepo?.name}
                </span>
                <img src="/downArrow.png" alt="" />

                {isRepoListOpen && (
                  <div className="RepoList_Container">
                    {repositories.map((repo) => {
                      return (
                        <div
                          key={repo._id}
                          className="RepoList_Item"
                          onClick={() => {
                            setSelectedRepo(repo);
                          }}
                        >
                          <img src="/newRepo.png" alt="" />
                          <span>
                            {userProfile.username}/{repo.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="template">Templates and forms</div>

            <div
              className="createNewIssue_Btn"
              onClick={() => {
                console.log(
                  "Navigating to:",
                  `/issue/create/${selectedRepo._id}`
                );
                navigate(`/issue/create/${selectedRepo._id}`);
              }}
            >
              <div className="text">
                <span>Blank Page</span>
                <span>Create a new issue from scratch</span>
              </div>
              <div className="nextIcon">
                <img src="/forwardArrow.png" alt="" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NewIssue;
