import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Optional: add your Navbar
import "./notFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigates to the Home page
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          background: "#0d1117",
          width: "100vw",
          height: "100vh",
        }}
      >
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <div
          onClick={handleGoHome}
          className="notFound_Btn"
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            fontSize: "1.1rem",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Go to Home
        </div>
      </div>
    </>
  );
};

export default NotFound;
