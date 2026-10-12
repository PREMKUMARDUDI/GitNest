import React, { createContext, useState, useEffect, useContext } from "react";
import { clientServer } from "./serverConfig";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const getUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      const res = await clientServer.get(`/userProfile`);
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Error fetching user profile : ", err);
      localStorage.removeItem("token");
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    getUserProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
