import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { clientServer } from "../../serverConfig";
import Navbar from "../navbar/Navbar";
import "./deleteRepo.css";

const DeleteRepo = () => {
  const { repoId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [repo, setRepo] = useState({});
  const [isLoadingRepo, setIsLoadingRepo] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const res = await clientServer.get(`/repo/${repoId}`);
        setRepo(res.data);
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

  const handleDelete = async (e) => {
    e.preventDefault();
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await clientServer.delete(`/repo/delete/${repoId}`);

      navigate(`/`);
    } catch (err) {
      console.error("Error deleting repository : ", err);
      setErrorMessage("Failed to delete repository. Please try again.");
      setIsDeleting(false);
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
      <div
        className="RepoDelete_Container"
        onClick={() => {
          navigate(`/repo/${repoId}`);
        }}
      >
        <div className="delete_Container" onClick={(e) => e.stopPropagation()}>
          <div className="delete_Top">
            <div className="deleteRepo_Name">
              Delete {repo.owner?.username}/{repo.name}
            </div>
            <div
              className="deleteContainer_Collapse"
              onClick={() => {
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

          <button
            className="deleteRepo_Btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <span>
              {isDeleting ? "Deleting..." : "I want to delete this repository"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteRepo;
