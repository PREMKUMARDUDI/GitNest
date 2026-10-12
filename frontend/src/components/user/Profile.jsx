import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { clientServer } from "../../serverConfig";
import Navbar from "../navbar/Navbar";
import "./profile.css";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [repositories, setRepositories] = useState([]);
  const [isLoadingUserRepos, setIsLoadingUserRepos] = useState(true);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const res = await clientServer.get(`/repo/user`);

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

  if (!currentUser || isLoadingUserRepos) {
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
                src="/copilot.png"
                alt=""
                width={"70%"}
                style={{ borderRadius: "50%" }}
              />
            </div>
            <div className="name">
              <h3 style={{ textAlign: "center" }}>
                {currentUser ? currentUser.username : "Username"}
              </h3>
            </div>
            <div className="follower">
              <p>{Math.floor(Math.random() * 50) + 20} Follower</p>
              <p>{Math.floor(Math.random() * 10) + 1} Following</p>
            </div>
          </div>

          <div className="heat-map-section">
            <h2>Recent Contributions</h2>
            {repositories.length === 0 && (
              <h3 style={{ color: "grey" }}>No Contributions yet</h3>
            )}
            {repositories.length != 0 && (
              <img
                src="/heatMap.png
            "
                alt=""
              />
            )}
          </div>
        </div>

        <h2>Repositories</h2>
        <div className="repositories_UserProfile">
          {repositories.length === 0 && (
            <h3 style={{ color: "grey" }}>No Repositories yet</h3>
          )}
          {repositories.map((repo) => {
            return (
              <div className="repo_Item" key={repo._id}>
                <span className="repo_Name">
                  {" "}
                  <img
                    src="/newRepo.png"
                    alt=""
                    style={{
                      width: "1rem",
                      marginRight: "0.45rem",
                      marginBottom: "-0.05rem",
                    }}
                  />
                  {repo.name}
                </span>
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
            logout();
            navigate("/auth");
          }}
          style={{ position: "absolute", bottom: "50px", right: "70px" }}
          id="logout"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;
