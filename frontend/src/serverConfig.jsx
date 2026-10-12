import axios from "axios";

export const BASE_URL = "https://gitnest-sh8l.onrender.com";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});

clientServer.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
