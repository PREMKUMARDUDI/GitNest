import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { clientServer } from "../../serverConfig";
import Navbar from "../navbar/Navbar";
import "./deleteIssue.css";

const DeleteIssue = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [issue, setIssue] = useState({});
  const [repository, setRepository] = useState({});
  const [isLoadingIssue, setIsLoadingIssue] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await clientServer.get(`/issue/${id}`);
        setIssue(res.data);
        setRepository(res.data.repository);
      } catch (err) {
        console.error("Error fetching issue : ", err);
        setErrorMessage("Could not load issue information.");
      } finally {
        setIsLoadingIssue(false);
      }
    };

    if (id) fetchIssue();
  }, [id]);

  useEffect(() => {
    if (!isLoadingIssue && issue.owner?._id !== currentUser?._id) {
      navigate(`/issue/${id}`);
    }
  }, [isLoadingIssue, issue.owner?._id, currentUser?._id, id, navigate]);

  const handleIssueDelete = async (e) => {
    e.preventDefault();
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await clientServer.delete(`/issue/delete/${id}`);

      navigate(`/repo/${repository._id}`);
    } catch (err) {
      console.error("Error deleting issue : ", err);
      setErrorMessage("Failed to delete issue. Please try again.");
      setIsDeleting(false);
    }
  };

  // Show loading indicator while data is loading
  if (isLoadingIssue) {
    return (
      <div style={{ marginLeft: "2rem" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (errorMessage && !issue) {
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
        className="issueDelete_Container"
        onClick={() => {
          navigate(`/issue/${id}`);
        }}
      >
        <div
          className="deleteIssue_Container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="deleteIssue_Top">
            <div className="deleteIssue_Name">
              Delete {repository.name}/{issue.title}
            </div>
            <div
              className="deleteIssueContainer_Collapse"
              onClick={() => {
                navigate(`/issue/${id}`);
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

          <div className="deleteIssue_Body">
            <img src="/newIssue.png" alt="" />
            <div className="deleteIssue_Name2">
              Delete {repository.name}/{issue.title}
            </div>
          </div>

          <div
            className="deleteIssue_Btn"
            onClick={handleIssueDelete}
            disabled={isDeleting}
          >
            <span>
              {" "}
              {isDeleting ? "Deleting..." : "I want to delete this issue"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteIssue;
