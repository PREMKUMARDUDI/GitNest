import React, { useState, useEffect, useMemo } from "react";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./AllIssues.css";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";

const AllIssues = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [userProfile, setUserProfile] = useState("");
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);

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

    const fetchAllIssues = async () => {
      try {
        const res = await clientServer.get(`/issue/all`);

        const issues = res.data;
        setIssues(issues.reverse());
        setIsLoadingIssues(false);
        console.log("All issues:", issues);
      } catch (err) {
        console.error("Error fetching issues : ", err);
        setIsLoadingIssues(false);
      }
    };

    fetchAllIssues();
  }, []);

  if (isLoadingIssues) {
    return (
      <div style={{ marginLeft: "2rem" }}>
        <h2>Loading...</h2>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <div className="issue-main-container">
        <h2>Issues</h2>
        <div className="issues_Container">
          {issues.length === 0 && (
            <h3 style={{ color: "grey" }}>No Issues yet</h3>
          )}
          {issues.map((issue) => {
            return (
              <div className="issue_Item" key={issue._id}>
                <span className="issue_Name">{issue.title}</span>
                <span className="issue_Desc">{issue.description}</span>
                <span
                  className="issue_Link"
                  onClick={() => {
                    navigate(`/issue/${issue._id}`);
                  }}
                >
                  View Issue
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
          style={{ position: "absolute", bottom: "50px", right: "70px" }}
        >
          Go Back
        </button>
      </div>
    </>
  );
};

export default AllIssues;
