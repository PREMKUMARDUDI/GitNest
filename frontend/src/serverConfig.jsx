import axios from "axios";

export const BASE_URL = "https://gitnest-sh8l.onrender.com";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});
