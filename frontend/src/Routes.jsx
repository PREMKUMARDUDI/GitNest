import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

//Pages List
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import CreateRepo from "./components/repo/CreateRepo.jsx";
import RepoDetails from "./components/repo/RepoDetails.jsx";
import UpdateRepo from "./components/repo/UpdateRepo.jsx";
import DeleteRepo from "./components/repo/DeleteRepo.jsx";
import NewIssue from "./components/issue/NewIssue.jsx";
import CreateIssue from "./components/issue/CreateIssue.jsx";
import IssueDetails from "./components/issue/IssueDetails.jsx";
import UpdateIssue from "./components/issue/UpdateIssue.jsx";
import DeleteIssue from "./components/issue/DeleteIssue.jsx";
import NotFound from "./components/NotFound.jsx";

//Auth Context
import { useAuth } from "./authContext.jsx";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (
      !userIdFromStorage &&
      !["/auth", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/auth");
    }

    if (
      userIdFromStorage &&
      ["/auth", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/repo/create",
      element: <CreateRepo />,
    },
    {
      path: "/repo/:repoId",
      element: <RepoDetails />,
    },
    {
      path: "/repo/update/:repoId",
      element: <UpdateRepo />,
    },
    {
      path: "/repo/delete/:repoId",
      element: <DeleteRepo />,
    },
    {
      path: "/issue/new",
      element: <NewIssue />,
    },
    {
      path: "/issue/create/:repoId",
      element: <CreateIssue />,
    },
    {
      path: "/issue/:id",
      element: <IssueDetails />,
    },
    {
      path: "/issue/update/:id",
      element: <UpdateIssue />,
    },
    {
      path: "/issue/delete/:id",
      element: <DeleteIssue />,
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
