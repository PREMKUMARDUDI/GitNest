import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientServer } from "../serverConfig";
import { Link } from "react-router-dom";
import "./navbar.css";
import { useAuth } from "../authContext";

const Navbar = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isPullRequestOpen, setIsPullRequestOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [suggestedRepos, setSuggestedRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  const { setCurrentUser } = useAuth();
  const [userProfile, setUserProfile] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchUserProfile = async () => {
      try {
        const res = await clientServer.get(`/userProfile/${userId}`);

        const data = res.data;
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching User Profile : ", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchSuggestedRepositories = async () => {
      try {
        const res = await clientServer.get(`/repo/all`);

        const data = res.data;

        const allRepos = data.repositories;

        setSuggestedRepos(allRepos);
      } catch (err) {
        console.error("Error fetching repositories : ", err);
      }
    };

    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    console.log("Suggested Repos:", suggestedRepos);
  }, [suggestedRepos]);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(suggestedRepos);
      setIsSearchOpen(false);
    } else {
      const filteredRepo = suggestedRepos.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, suggestedRepos]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setIsChecked2(false);
  };

  const handleCheckboxChange2 = () => {
    setIsChecked2(!isChecked2);
    setIsChecked(false);
  };

  const handleCreateNewWindow = () => {
    setIsCreateNewOpen(!isCreateNewOpen);
  };

  const handleIssueWindow = () => {
    setIsIssueOpen(!isIssueOpen);
  };

  const handlePullRequestWindow = () => {
    setIsPullRequestOpen(!isPullRequestOpen);
  };

  const handleNotificationWindow = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <nav
      onClick={() => {
        setIsSearchOpen(false);
        setIsChecked(false);
        setIsChecked2(false);
        setIsCreateNewOpen(false);
      }}
    >
      <div className="left-navbar">
        <input
          type="checkbox"
          name="menu-checkbox"
          id="menu-checkbox"
          className="menu-checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <div className="left-menu" onClick={(e) => e.stopPropagation()}>
          <div className="left-menu-top">
            <div>
              <img
                src="/github-mark-white.svg"
                alt="GitHub Logo"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                }}
              />
            </div>
            <div className="left-menu-collapse" onClick={handleCheckboxChange}>
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
          <div className="left-menu-items-container">
            <div
              className="left-menu-item"
              onClick={() => {
                navigate("/");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <span>Home</span>
            </div>
            <div className="left-menu-item">
              <img
                src="/newIssue.png"
                alt=""
                style={{ width: "1.2rem", height: "1.2rem" }}
              />
              <span>Issues</span>
            </div>
            <div className="left-menu-item">
              <img src="/pullRequest.png" alt="" />
              <span>Pull Requests</span>
            </div>
            <div className="left-menu-item">
              <img src="/newProject.png" alt="" />
              <span>Project</span>
            </div>
            <div className="left-menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
              <span>Discussions</span>
            </div>
            <div className="left-menu-item">
              <img
                src="/newGist.png"
                alt=""
                style={{
                  width: "1rem",
                  height: "1rem",
                  marginInlineStart: "0.15rem",
                }}
              />
              <span>Codespaces</span>
            </div>
            <div
              className="left-menu-item"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                setCurrentUser(null);
                window.location.href = "/auth";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              <span>Logout</span>
            </div>
          </div>
        </div>
        <label htmlFor="menu-checkbox">
          <span className="menu-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="menu-svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </span>
        </label>

        <div
          onClick={() => navigate("/")}
          style={{
            marginLeft: "0.8rem",
            cursor: "pointer",
          }}
        >
          <img
            src="/github-mark-white.svg"
            alt="GitHub Logo"
            style={{
              width: "2rem",
              height: "2rem",
              position: "relative",
              top: "1rem",
            }}
          />
          <h3>GitNest</h3>
        </div>
      </div>
      <div className="right-navbar">
        <div className="search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search repositories ..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsChecked(false);
              setIsChecked2(false);
            }}
          />
          {isSearchOpen && searchResults.length !== 0 && (
            <div className="search-result-container">
              {searchResults.map((repo) => (
                <div
                  key={repo._id}
                  className="search-result-item"
                  onClick={() => navigate(`/repo/${repo._id}`)}
                >
                  {repo.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="break"></div>
        <div
          className="createNew"
          onClick={(e) => {
            e.stopPropagation();
            handleCreateNewWindow();
            setIsChecked(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>

          {isCreateNewOpen && (
            <div className="create-new-container">
              <div
                onClick={() => {
                  window.location.href = "/issue/new";
                }}
              >
                <img src="/newIssue.png" alt="" />
                <span>New issue</span>
              </div>
              <div
                onClick={() => {
                  window.location.href = "/repo/create";
                }}
              >
                <img src="/newRepo2.png" alt="" />
                <span>New repository</span>
              </div>
              <div>
                <img src="/importRepo2.png" alt="" />
                <span>Import repository</span>
              </div>
              <div>
                <img src="/newCodespace2.png" alt="" />
                <span>New codespace</span>
              </div>
              <div>
                <img src="/newGist.png" alt="" />
                <span>New gist</span>
              </div>
              <div>
                <img src="/newOrg2.png" alt="" />
                <span>New organization</span>
              </div>
              <div>
                <img src="/newProject.png" alt="" />
                <span>New project</span>
              </div>
            </div>
          )}

          {!isCreateNewOpen && (
            <div className="createNew_InfoContainer">Create new...</div>
          )}
        </div>
        <div className="issue">
          <img
            src="/newIssue.png"
            alt=""
            style={{ width: "1rem", height: "1rem" }}
          />

          {!isIssueOpen && (
            <div className="issue_InfoContainer">Your issues</div>
          )}
        </div>
        <div className="pullRequests">
          <img src="/pullRequest.png" alt="" />

          {!isPullRequestOpen && (
            <div className="pullRequests_InfoContainer">Your pull requests</div>
          )}
        </div>
        <div className="notification">
          <img src="/notification.png" alt="" />

          {!isNotificationOpen && (
            <div className="notifications_InfoContainer">
              You have no unread notifications
            </div>
          )}
        </div>
        <input
          type="checkbox"
          name="profile-checkbox"
          id="profile-checkbox"
          className="profile-checkbox"
          checked={isChecked2}
          onChange={handleCheckboxChange2}
        />
        <div className="right-menu" onClick={(e) => e.stopPropagation()}>
          <div className="right-menu-top">
            <div className="userProfile">
              <div
                className="userProfile_img"
                onClick={() => {
                  window.location.href = "/profile";
                }}
              >
                <img src="/copilot.png" alt="GitHub Logo" />
              </div>
              <span>{userProfile.username}</span>
            </div>
            <div
              className="right-menu-collapse"
              onClick={handleCheckboxChange2}
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
          <div className="right-menu-items-container">
            <div className="right-menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
              <span>Set Status</span>
            </div>
            <div
              style={{
                width: "17.9rem",
                border: "1px solid gray",
                marginBottom: "0.35rem",
              }}
            ></div>
            <div
              className="right-menu-item"
              onClick={() => {
                window.location.href = "/profile";
              }}
            >
              <img src="/profile.png" alt="" />
              <span>Your Profile</span>
            </div>
            <div className="right-menu-item">
              <img src="/newRepo2.png" alt="" />
              <span>Your Repository</span>
            </div>
            <div className="right-menu-item">
              <img src="/newProject.png" alt="" />
              <span>Your Project</span>
            </div>
            <div className="right-menu-item">
              <img src="/star.png" alt="" />
              <span>Your Stars</span>
            </div>
            <div className="right-menu-item">
              <img src="/newGist.png" alt="" />
              <span>Your Gists</span>
            </div>
            <div className="right-menu-item">
              <img src="/newOrg2.png" alt="" />
              <span>Your Organizations</span>
            </div>
            <div className="right-menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              <span>Your Enterprises</span>
            </div>
            <div className="right-menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <span>Your Sponsors</span>
            </div>
            <div
              style={{
                width: "17.9rem",
                border: "1px solid gray",
                marginBottom: "0.35rem",
              }}
            ></div>
            <div className="right-menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                />
              </svg>

              <span>Try Enterprise</span>
            </div>
            <div className="right-menu-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
              <span>Feature Preview</span>
            </div>
            <div className="right-menu-item">
              <img src="/setting.png" alt="" />
              <span>Settings</span>
            </div>
            <div
              style={{
                width: "17.9rem",
                border: "1px solid gray",
                marginBottom: "0.35rem",
              }}
            ></div>
            <div
              className="right-menu-item"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                setCurrentUser(null);
                window.location.href = "/auth";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              <span>Sign out</span>
            </div>
          </div>
        </div>
        <label htmlFor="profile-checkbox">
          <div className="profileMenu">
            <img src="/copilot.png" alt="" />
          </div>
        </label>

        {isChecked && <div className="blur-overlay"></div>}
        {isChecked2 && <div className="blur-overlay"></div>}
      </div>
    </nav>
  );
};

export default Navbar;
