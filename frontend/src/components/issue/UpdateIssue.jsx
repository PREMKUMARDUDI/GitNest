import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./updateIssue.css";

const UpdateIssue = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState({});

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");

  const userId = localStorage.getItem("userId");

  const [isLoadingIssue, setIsLoadingIssue] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSelectedIssue = async () => {
      try {
        const res = await clientServer.get(`/issue/${id}`);
        console.log("selectedIssue : ", res);
        const data = res.data;
        setIssue(data);
        setIsLoadingIssue(false);
        setDescription(data.description);
        setStatus(data.status);
        console.log("selected Issue:", data);
      } catch (err) {
        console.error("Error fetching issue : ", err);
        setIsLoadingIssue(false);
      }
    };

    if (id) fetchSelectedIssue();
  }, [id]);

  useEffect(() => {
    if (issue.repository && issue.repository.owner !== userId) {
      navigate(`/issue/${id}`);
    }
  }, [issue.repository, userId, id, navigate]);

  const handleIssueUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await clientServer.put(`/issue/update/${id}`, {
        description,
        status,
      });

      console.log("updated Issue : ", res.data);
      navigate(`/issue/${id}`);
    } catch (err) {
      console.error("Error updating issue : ", err);
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

  return (
    <>
      <Navbar />
      <div className="issueUpdate_Container">
        <div className="issue_Top">
          <h2>{issue.title}</h2>
        </div>

        <div className="issue_Repo">
          <span>Repository</span> :{" "}
          <span>{issue.repository?.name || "Unknown"}</span>
        </div>

        <form onSubmit={handleIssueUpdate}>
          <div className="issue_Description">
            <label htmlFor="issueDesc_Update">
              <span>Description</span>
            </label>
            {":   "}
            <input
              type="text"
              id="issueDesc_Update"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <div className="issue_Status">
            <span style={{ fontWeight: "700", fontSize: "1.1rem" }}>
              Status
            </span>
            {":"}
            <span>
              <div className="open_Container">
                <input
                  type="radio"
                  name="status"
                  id="open"
                  value="open"
                  checked={status === "open"}
                  onChange={() => setStatus("open")}
                />
                <label htmlFor="open">
                  <div className="open">
                    <img
                      src="/newIssue.png"
                      alt=""
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                    <div>
                      <span>Open</span>
                    </div>
                  </div>
                </label>
              </div>
            </span>

            <span>
              <div className="closed_Container">
                <input
                  type="radio"
                  name="status"
                  id="closed"
                  value="closed"
                  checked={status === "closed"}
                  onChange={() => setStatus("closed")}
                />
                <label htmlFor="closed">
                  <div className="closed">
                    <img
                      src="/closedIssue.png"
                      alt=""
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                    <div>
                      <span>Closed</span>
                    </div>
                  </div>
                </label>
              </div>
            </span>
          </div>

          <div className="issue_Change">
            <button type="submit" className="update_Issue">
              Update Issue
            </button>
            <button
              type="button"
              className="cancel_update_Issue"
              onClick={() => navigate(`/issue/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateIssue;
