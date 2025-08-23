import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./updateRepo.css";

const UpdateRepo = () => {
  const { repoId } = useParams();
  const [repo, setRepo] = useState({});

  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);

  const userId = localStorage.getItem("userId");

  const [isLoadingRepo, setIsLoadingRepo] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const res = await clientServer.get(`/repo/${repoId}`);
        setRepo(res.data);
        setIsLoadingRepo(false);
        setDescription(res.data.description || "");
        setVisibility(
          res.data.visibility !== undefined ? res.data.visibility : true
        );
      } catch (err) {
        console.error("Error fetching repository details : ", err);
        setIsLoadingRepo(false);
      }
    };
    if (repoId) fetchRepository();
  }, [repoId]);

  useEffect(() => {
    if (repo.owner && repo.owner._id !== userId) {
      navigate(`/repo/${repoId}`);
    }
  }, [repo.owner, userId, repoId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await clientServer.put(`/repo/update/${repoId}`, {
        description,
        visibility,
      });

      console.log("updated Repo : ", res.data);
      navigate(`/repo/${repoId}`);
    } catch (err) {
      console.error("Error updating repository : ", err);
    }
  };

  // Show loading indicator while data is loading
  if (isLoadingRepo) {
    return (
      <div style={{ marginLeft: "2rem" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="RepoUpdate_Container">
        <div className="repo_Top">
          <h2>{repo.name}</h2>
        </div>

        <div className="repo_Owner">
          <span>Owner</span> : <span>{repo.owner?.username || "Unknown"}</span>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="repo_Description">
            <label htmlFor="desc_Update">
              <span>Description</span>
            </label>
            {":   "}
            <input
              type="text"
              id="desc_Update"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <div className="repo_Visibility">
            <span style={{ fontWeight: "700", fontSize: "1.1rem" }}>
              Visibility
            </span>
            {":"}
            <span>
              <div className="public_Container">
                <input
                  type="radio"
                  name="visibility"
                  id="public"
                  value="true"
                  checked={visibility === true}
                  onChange={() => setVisibility(true)}
                />
                <label htmlFor="public">
                  <div className="public">
                    <img
                      src="/newRepo.png"
                      alt=""
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                    <div>
                      <span>Public</span>
                    </div>
                  </div>
                </label>
              </div>
            </span>

            <span>
              <div className="private_Container">
                <input
                  type="radio"
                  name="visibility"
                  id="private"
                  value="false"
                  checked={visibility === false}
                  onChange={() => setVisibility(false)}
                />
                <label htmlFor="private">
                  <div className="private">
                    <img
                      src="/lock.png"
                      alt=""
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                    <div>
                      <span>Private</span>
                    </div>
                  </div>
                </label>
              </div>
            </span>
          </div>

          <div className="repo_Change">
            <button type="submit" className="update_Repo">
              Update Repository
            </button>
            <button
              type="button"
              className="cancel_update_Repo"
              onClick={() => navigate(`/repo/${repoId}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateRepo;
