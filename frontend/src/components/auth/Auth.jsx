import React, { useState, useEffect, useRef } from "react";
import { clientServer } from "../../serverConfig";
import { useAuth } from "../../authContext";
import { PageHeader, Box, Button, Spinner } from "@primer/react";
import logo from "../../assets/github-mark-white.svg";
import "./auth.css";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCurrentUser } = useAuth();

  // Refs for pristine focus initialization when toggling screens
  const emailInputRef = useRef(null);
  const usernameInputRef = useRef(null);

  const clearInputFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
  };

  // Automatically shifts initial focus to the first view-appropriate field
  useEffect(() => {
    clearInputFields();
    setShowPassword(false);

    if (!isSignUp) {
      emailInputRef.current?.focus();
    } else {
      usernameInputRef.current?.focus();
    }
  }, [isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Blur active elements to lower mobile virtual keyboards smoothly on submit
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Only Gmail addresses are allowed!");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isSignUp ? "/signup" : "/login";
      const payload = isSignUp
        ? { email, username, password }
        : { email, password };

      const res = await clientServer.post(endpoint, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);

      setCurrentUser(res.data.user.id);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setPassword("");
      setError(
        err.response?.data?.message ||
          `${isSignUp ? "Signup" : "Login"} Failed!`,
      );
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
                <PageHeader.Title>
                  {isSignUp ? "Sign Up" : "Sign In"}
                </PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>

        <form onSubmit={handleSubmit} className="login-box">
          {error && <div className="auth-error-msg">{error}</div>}

          {isSignUp && (
            <div>
              <label className="label" htmlFor="Username">
                Username
              </label>
              <input
                autoComplete="off"
                name="Username"
                id="Username"
                ref={usernameInputRef}
                className="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="label" htmlFor="Email">
              Email address
            </label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              ref={emailInputRef}
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="Password">
              Password
            </label>
            <div className="password-input-container">
              <input
                autoComplete="off"
                name="Password"
                id="Password"
                className="input password-field"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password.length > 0 && (
                <span
                  className="password-toggle-span"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://w3.org"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://w3.org"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Spinner size="small" variant="transparent" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="pass-box">
          <p style={{ margin: 0, color: "#f1f6fd" }}>
            {isSignUp ? "Already have an account? " : "New to GitHub? "}
            <span
              className="signup-toggle-link"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Login" : "Create an account"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
