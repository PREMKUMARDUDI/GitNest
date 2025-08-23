import React, { useState, useEffect, useMemo } from "react";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./dashboard.css";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepos, setSuggestedRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");

  const { setCurrentUser } = useAuth();
  const [userProfile, setUserProfile] = useState("");

  const [isLoadingUserRepos, setIsLoadingUserRepos] = useState(true);
  const [isLoadingSuggestedRepos, setIsLoadingSuggestedRepos] = useState(true);
  const navigate = useNavigate();

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

    const fetchRepositories = async () => {
      try {
        const res = await clientServer.get(`/repo/user/${userId}`);

        const data = res.data;
        setRepositories(data.repositories.reverse());
        setIsLoadingUserRepos(false);
        console.log("currUser Repos:", data.repositories);
      } catch (err) {
        console.error("Error fetching repositories : ", err);
        setIsLoadingUserRepos(false);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const res = await clientServer.get(`/repo/all`);

        const data = res.data;

        const otherRepos = data.repositories?.filter(
          (repo) => repo.owner?._id !== userId
        );

        setSuggestedRepos(otherRepos);
        setIsLoadingSuggestedRepos(false);
      } catch (err) {
        console.error("Error fetching suggested repositories : ", err);
        setIsLoadingSuggestedRepos(false);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    console.log("Suggested Repos:", suggestedRepos);
  }, [suggestedRepos]);

  // useMemo for user repositories filtering
  const filteredRepositories = useMemo(() => {
    if (!searchQuery) return repositories;
    return repositories.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [repositories, searchQuery]);

  // useMemo for suggested repositories filtering
  const filteredSuggestedRepos = useMemo(() => {
    if (!searchQuery2) return suggestedRepos;
    return suggestedRepos.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery2.toLowerCase())
    );
  }, [suggestedRepos, searchQuery2]);

  if (isLoadingUserRepos || isLoadingSuggestedRepos) {
    return (
      <div style={{ marginLeft: "2rem" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="leftContainer">
          <div className="leftContainer_Top">
            <h4>Your Repositories</h4>
            <div
              className="newRepo_Btn"
              type="button"
              onClick={() => navigate("/repo/create")}
            >
              <img
                src="newRepo.png"
                alt=""
                style={{ width: "0.9rem", marginRight: "0.25rem" }}
              />
              New
            </div>
          </div>
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
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredRepositories.map((repo) => {
            return (
              <div className="searchResult_item" key={repo._id}>
                <img src="copilot.png" alt="" />
                <Link to={`/repo/${repo._id}`}>
                  {userProfile.username}/{repo.name}
                </Link>
              </div>
            );
          })}

          <div className="border_for_separation"></div>

          <div className="leftSuggestionContainer_Top">
            <h4>Suggested Repositories</h4>
          </div>
          <div className="suggestedRepo_Search">
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
              placeholder="Search suggested repositories..."
              value={searchQuery2}
              onChange={(e) => setSearchQuery2(e.target.value)}
            />
          </div>

          {filteredSuggestedRepos.map((repo) => {
            return (
              <div className="suggestedSearchResult_item" key={repo._id}>
                <img src="copilot.png" alt="" />
                <Link to={`/repo/${repo._id}`}>
                  {repo.owner?.username}/{repo.name}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mainContainer">
          <h2>Home</h2>

          {repositories.map((repo) => {
            return (
              <div className="repoItem" key={repo._id}>
                <span className="name">{repo.name}</span>
                <span className="desc">{repo.description}</span>
                <span
                  className="link"
                  onClick={() => {
                    navigate(`/repo/${repo._id}`);
                  }}
                >
                  View Repository
                </span>
              </div>
            );
          })}
        </div>

        <div className="rightContainer">
          <h3> Trending</h3>

          <div className="trending">
            <h4>Latest Changes</h4>
            <ul>
              <li>
                <span>2 days ago</span>
                <span>
                  Secret Protection expands <br /> default pattern support and{" "}
                  <br />
                  adds extra validators.
                </span>
              </li>
              <li>
                <span>3 days ago</span>
                <span>
                  Defense of third-party claims <br />
                  added for volume licensing customers.
                </span>
              </li>
              <li>
                <span>5 days ago</span>
                <span>
                  Clearer pull request reviewer <br /> status and enhanced email{" "}
                  <br />
                  filtering.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
