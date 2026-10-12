import React, { useEffect } from "react";
import { useNavigate, useRoutes, useLocation } from "react-router-dom";
import { useAuth } from "./authContext.jsx";

//Pages List
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Auth from "./components/auth/Auth.jsx";
import CreateRepo from "./components/repo/CreateRepo.jsx";
import RepoDetails from "./components/repo/RepoDetails.jsx";
import UpdateRepo from "./components/repo/UpdateRepo.jsx";
import DeleteRepo from "./components/repo/DeleteRepo.jsx";
import NewIssue from "./components/issue/NewIssue.jsx";
import CreateIssue from "./components/issue/CreateIssue.jsx";
import AllIssues from "./components/issue/AllIssues.jsx";
import IssueDetails from "./components/issue/IssueDetails.jsx";
import UpdateIssue from "./components/issue/UpdateIssue.jsx";
import DeleteIssue from "./components/issue/DeleteIssue.jsx";
import NotFound from "./components/notFound/NotFound.jsx";

const ProjectRoutes = () => {
  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !["/auth"].includes(location.pathname)) {
      navigate("/auth");
    }

    if (token && ["/auth"].includes(location.pathname)) {
      navigate("/");
    }
  }, [currentUser, navigate, location.pathname]);

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
      element: <Auth />,
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
      path: "/issue/all",
      element: <AllIssues />,
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
