import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./createIssue.css";

const CreateIssue = () => {
  const { repoId } = useParams();
  const [selectedRepo, setSelectedRepo] = useState({});
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(true);

  const [userProfile, setUserProfile] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    const fetchSelectedRepo = async () => {
      try {
        const res = await clientServer.get(`/repo/${repoId}`);
        console.log(res);
        const data = res.data;
        setSelectedRepo(data);
        console.log("selected Repo:", data);
      } catch (err) {
        console.error("Error fetching repositories : ", err);
      }
    };

    fetchSelectedRepo();
  }, []);

  // This effect triggers redirect 1 seconds after a successful submit
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1000); // 1 seconds delay; adjust as needed

      return () => clearTimeout(timer); // cleanup in case component unmounts
    }
  }, [submitSuccess, navigate]);

  const handleIssueCreation = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitSuccess(false);

    if (!title.trim()) {
      setFormError("Title is required!");
      return;
    }
    if (!userProfile || !userProfile._id) {
      setFormError("User information not loaded. Cannot create repository.");
      return;
    }
    if (description === "") {
      setFormError("Description is required!");
      return;
    }

    try {
      const res = await clientServer.post(`/issue/create/${repoId}`, {
        title,
        description,
        owner: userProfile._id,
      });

      console.log("Issue created:", res);
      setSubmitSuccess(true);

      // Reset form fields after success
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating issue:", err);
      setFormError("Failed to create issue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="createIssue_OuterContainer"
        onClick={() => {
          setIsCreateIssueOpen(false);
          navigate("/issue/new");
        }}
      >
        {isCreateIssueOpen && (
          <div
            className="createIssue_Container"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="createIssue_Top">
              <div className="createIssue_Name">
                Create new issue in {selectedRepo.owner?.username}/
                {selectedRepo.name}{" "}
              </div>
              <div
                className="createIssue_Collapse"
                onClick={() => {
                  setIsCreateIssueOpen(false);
                  navigate(`/issue/new`);
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

            <div className="createIssue_Body">
              <div className="title_Container">
                <label htmlFor="issue_Title">
                  <span>
                    Add a title <span>*</span>
                  </span>
                </label>
                <input
                  type="text"
                  id="issue_Title"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => {
                    e.preventDefault();
                    setTitle(e.target.value);
                  }}
                />
              </div>

              <div className="description_Container">
                <label htmlFor="issue_Description">
                  {" "}
                  <span>
                    Add a description <span>*</span>
                  </span>
                </label>
                <textarea
                  id="issue_Description"
                  placeholder="Type your description here..."
                  value={description}
                  onChange={(e) => {
                    e.preventDefault();
                    setDescription(e.target.value);
                  }}
                ></textarea>
              </div>
            </div>

            <div className="createIssue_Btn">
              <div className="left">
                {/* FORM ERROR */}
                {formError && (
                  <div role="alert" style={{ color: "red", marginTop: "1rem" }}>
                    {formError}
                  </div>
                )}
                {/* SUCCESS MESSAGE */}
                {submitSuccess && (
                  <div
                    role="alert"
                    style={{ color: "green", marginTop: "1rem" }}
                  >
                    Issue created successfully!
                  </div>
                )}
              </div>
              <div className="right">
                <div
                  className="cancel"
                  onClick={() => {
                    setIsCreateIssueOpen(false);
                    navigate(`/issue/new`);
                  }}
                >
                  Cancel
                </div>
                <div className="create" onClick={handleIssueCreation}>
                  Create
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateIssue;
