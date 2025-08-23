import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clientServer } from "../../serverConfig";
import "./profile.css";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [userDetails, setUserDetails] = useState({ username: "Username" });
  const { setCurrentUser } = useAuth();
  const [isLoadingUserRepos, setIsLoadingUserRepos] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await clientServer.get(`/userProfile/${userId}`);
          setUserDetails(response.data);
          setIsLoadingUser(false);
        } catch (err) {
          console.error("Error fetching user details : ", err);
          setIsLoadingUser(false);
        }
      }
    };
    fetchUserDetails();
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

    fetchRepositories();
  }, []);

  if (isLoadingUser || isLoadingUserRepos) {
    return (
      <div style={{ marginLeft: "2rem" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-page-wrapper">
          <div className="user-profile-section">
            <div className="profile-image">
              <img
                src="copilot.png"
                alt=""
                width={"70%"}
                style={{ borderRadius: "50%" }}
              />
            </div>
            <div className="name">
              <h3 style={{ textAlign: "center" }}>{userDetails.username}</h3>
            </div>
            <button className="follow-btn">Follow</button>
            <div className="follower">
              <p>{Math.floor(Math.random() * 50) + 20} Follower</p>
              <p>{Math.floor(Math.random() * 10) + 1} Following</p>
            </div>
          </div>

          <div className="heat-map-section">
            <h2>Recent Contributions</h2>
            <img
              src="/heatMap.png
            "
              alt=""
            />
          </div>
        </div>

        <h2>Repositories</h2>
        <div className="repositories_UserProfile">
          {repositories.map((repo) => {
            return (
              <div className="repo_Item" key={repo._id}>
                <span className="repo_Name">{repo.name}</span>
                <span className="repo_Desc">{repo.description}</span>
                <span
                  className="repo_Link"
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

        <button
          className="go_Back"
          onClick={() => {
            navigate("/");
          }}
          style={{ position: "absolute", bottom: "50px", right: "200px" }}
        >
          Go Back
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCurrentUser(null);
            navigate("/auth");
          }}
          style={{ position: "absolute", bottom: "50px", right: "50px" }}
          id="logout"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;
