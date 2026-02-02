import React, { useState, useEffect, useMemo } from "react";
import { clientServer } from "../../serverConfig";
import Navbar from "../Navbar";
import "./AllIssues.css";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";

const AllIssues = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [suggestedIssues, setSuggestedIssues] = useState([]);
  const [userProfile, setUserProfile] = useState("");
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [isLoadingSuggestedIssues, setIsLoadingSuggestedIssues] =
    useState(true);

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

    const fetchIssues = async () => {
      try {
        const res = await clientServer.get(`/issue/user/${userId}`);

        const issues = res.data;
        setIssues(issues.reverse());
        setIsLoadingIssues(false);
        console.log("issues:", issues);
      } catch (err) {
        console.error("Error fetching issues : ", err);
        setIsLoadingIssues(false);
      }
    };

    const fetchSuggestedIssues = async () => {
      try {
        const res = await clientServer.get(`/issue/all`);

        const allIssues = res.data;
        const suggestedIssues = allIssues?.filter(
          (issue) => issue.owner?._id !== userId,
        );
        setSuggestedIssues(suggestedIssues.reverse());
        setIsLoadingSuggestedIssues(false);
        console.log("suggested issues:", suggestedIssues);
      } catch (err) {
        console.error("Error fetching suggested issues : ", err);
        setIsLoadingSuggestedIssues(false);
      }
    };

    fetchIssues();
    fetchSuggestedIssues();
  }, []);

  if (isLoadingIssues || isLoadingSuggestedIssues) {
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

        {issues.length != 0 && (
          <>
            <h3 style={{ marginLeft: "2rem" }}>Your Issues</h3>
            <div className="issues_Container" style={{ marginBottom: "-3rem" }}>
              {issues.map((issue) => {
                return (
                  <div className="issue_Item" key={issue._id}>
                    <span className="issue_Name">
                      <img
                        src="/newIssue.png"
                        alt=""
                        style={{
                          width: "1rem",
                          marginRight: "0.25rem",
                          marginBottom: "-0.1rem",
                        }}
                      />
                      {issue.title}
                    </span>
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
          </>
        )}

        {suggestedIssues.length != 0 && (
          <>
            <h3 style={{ marginLeft: "2rem" }}>Suggested Issues</h3>
            <div className="issues_Container">
              {suggestedIssues.map((issue) => {
                return (
                  <div className="issue_Item" key={issue._id}>
                    <span className="issue_Name">
                      <img
                        src="/newIssue.png"
                        alt=""
                        style={{
                          width: "1rem",
                          marginRight: "0.25rem",
                          marginBottom: "-0.1rem",
                        }}
                      />
                      {issue.title}
                    </span>
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
          </>
        )}

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
