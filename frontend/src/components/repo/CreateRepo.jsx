import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { clientServer } from "../../serverConfig";
import Navbar from "../navbar/Navbar";
import "./createRepo.css";

const CreateRepo = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [addReadme, setAddReadme] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [submitSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitSuccess(false);

    // Simple validation: repoName must not be empty
    if (!repoName.trim()) {
      setFormError("Repository name is required!");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required!");
      return;
    }
    if (!currentUser || !currentUser?._id) {
      setFormError("User information not loaded. Cannot create repository.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await clientServer.post("/repo/create", {
        name: repoName,
        description,
        visibility,
        content: [],
        issues: [],
      });

      console.log("Repository created:", res);
      setSubmitSuccess(true);

      // Reset form fields after success
      setRepoName("");
      setDescription("");
      setVisibility(true);
      setAddReadme(false);
    } catch (err) {
      console.error("Error creating repository:", err);
      setFormError("Failed to create repository. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main_Container">
        <span className="heading">Create a new repository</span>

        <p className="about">
          A repository contains all project files, including the revision
          history. Already have a project repository elsewhere?{" "}
          <a href="">Import a repository.</a>
        </p>

        <p className="message">
          Required fields are marked with an asterisk (*).
        </p>

        <form className="form_CreateRepo" onSubmit={handleSubmit} noValidate>
          <div className="inputsWrapper">
            <div className="owner">
              <label htmlFor="owner">Owner*</label>
              <div className="select_Owner">
                <select id="owner" name="owner">
                  <option value="">Select Owner</option>
                  <option value="">{currentUser?.username}</option>
                </select>
                <img src="/downArrow.png" alt="" />
              </div>
            </div>

            <div className="repoName">
              <label htmlFor="repoName">Repository name*</label>
              <input
                id="repoName"
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="suggestion">
            Great repository names are short and memorable.
          </div>

          <div className="description">
            <label htmlFor="description">Description (optional)</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required
            />
          </div>

          <div className="visibility">
            <span>Visibility</span>

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
                    <span className="span_1">Public</span>
                    <span className="span_2">
                      Anyone on the internet can see this repository. You choose
                      who can commit.
                    </span>
                  </div>
                </div>
              </label>
            </div>

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
                    <span className="span_1">Private</span>
                    <span className="span_2">
                      You choose who can see and commit to this repository.
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="readme">
            <input
              type="checkbox"
              name="readme"
              id="readme"
              checked={addReadme}
              onChange={(e) => setAddReadme(e.target.checked)}
            />
            <label htmlFor="readme">Add Readme * </label>
          </div>

          {/* FORM ERROR */}
          {formError && (
            <div role="alert" style={{ color: "red", marginTop: "1rem" }}>
              {formError}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {submitSuccess && (
            <div role="alert" style={{ color: "green", marginTop: "1rem" }}>
              Repository created successfully!
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="submit">
            <button
              type="button"
              className="cancel_Btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="createRepo_Btn"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Repository"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateRepo;
