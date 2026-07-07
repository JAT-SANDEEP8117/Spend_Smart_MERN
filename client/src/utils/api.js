import axios from "axios";

// Use VITE_API_BASE_URL env variable in production; fall back to localhost for dev
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Request interceptor — attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        // Corrupted localStorage entry — ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle expired/invalid tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is expired or invalid — clear session and redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("loginTimestamp");
      localStorage.removeItem("lastActivityTimestamp");
      // Dispatch event so AuthContext can react
      window.dispatchEvent(new Event("sessionExpired"));
    }
    return Promise.reject(error);
  }
);

export default api;
