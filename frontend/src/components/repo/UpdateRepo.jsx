import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { clientServer } from "../../serverConfig";
import Navbar from "../navbar/Navbar";
import "./updateRepo.css";

const UpdateRepo = () => {
  const { repoId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [repo, setRepo] = useState({});
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [isLoadingRepo, setIsLoadingRepo] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const res = await clientServer.get(`/repo/${repoId}`);
        const repoData = res.data;
        setRepo(repoData);
        setDescription(
          repoData.description !== undefined ? repoData.description : "",
        );
        setVisibility(
          repoData.visibility !== undefined ? repoData.visibility : true,
        );
      } catch (err) {
        console.error("Error fetching repository details : ", err);
        setErrorMessage("Could not load repository information.");
      } finally {
        setIsLoadingRepo(false);
      }
    };

    if (repoId) fetchRepository();
  }, [repoId]);

  useEffect(() => {
    if (!isLoadingRepo && repo.owner?._id !== currentUser?._id) {
      navigate(`/repo/${repoId}`);
    }
  }, [isLoadingRepo, repo.owner?._id, currentUser?._id, repoId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await clientServer.put(`/repo/update/${repoId}`, {
        description,
        visibility,
      });

      navigate(`/repo/${repoId}`);
    } catch (err) {
      console.error("Error updating repository : ", err);
      setErrorMessage("Failed to update repository. Please try again.");
      setIsUpdating(false);
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

  if (errorMessage && !repo) {
    return (
      <div style={{ marginLeft: "2rem" }}>
        <h2>Error</h2>
        <p>{errorMessage}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
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
            <button type="submit" className="update_Repo" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Repository"}
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
