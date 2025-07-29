import axios from "axios";

export const api = axios.create({
  // baseURL: "https://api.deepen.live/api/v1", // Replace with your API base URL\
  baseURL: "http://localhost:3000/api/v1", // Replace with your API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
