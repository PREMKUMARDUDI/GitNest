import React, { useState, useEffect } from "react";
import { clientServer } from "../../serverConfig";
import { useAuth } from "../../authContext";

import { PageHeader, Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    const isUsernameEmpty = !username.trim();
    const isEmailEmpty = !email.trim();
    const isPasswordEmpty = !password.trim();

    const isNotGmail = !email.toLowerCase().endsWith("@gmail.com");

    if (isUsernameEmpty || isEmailEmpty || isPasswordEmpty || isNotGmail) {
      if (isUsernameEmpty) alert("Username cannot be empty!");
      else if (isEmailEmpty) alert("Email cannot be empty!");
      else if (isPasswordEmpty) alert("Password cannot be empty!");
      else if (isNotGmail) alert("Only Gmail addresses are allowed!");

      setTimeout(() => {
        setUsername("");
        setEmail("");
        setPassword("");
      }, 10);

      return;
    }

    try {
      setLoading(true);
      const res = await clientServer.post("/signup", {
        email: email,
        password: password,
        username: username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);

      setCurrentUser(res.data.user.id);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setUsername("");
      setEmail("");
      setPassword("");
      alert("Signup Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <PageHeader>
              <PageHeader.TitleArea variant="large">
                <PageHeader.Title>Sign Up</PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Username</label>
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="div">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="submit-btn"
            disabled={loading}
            onClick={handleSignup}
          >
            {loading ? "Loading..." : "Signup"}
          </Button>
        </div>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
