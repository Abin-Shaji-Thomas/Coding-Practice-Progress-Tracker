// A shared axios instance for calling the backend API.
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Before every request, attach the JWT token (if the user is logged in)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// Helper to get a readable error message from an axios error
export function getError(err) {
  if (err.response && err.response.data && err.response.data.message) {
    return err.response.data.message;
  }
  return "Something went wrong. Please check your connection and try again.";
}

export default api;
