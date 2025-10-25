// axiosInstance.js
import axios from "axios";
import { getAuth, setAuth } from "../context/authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

// Response interceptor
let retryCount = 0;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      originalRequest.url.includes("/users/refresh-token") ||
      originalRequest.url.includes("/users/login") ||
      originalRequest.url.includes("/users/register")
    ) {
      {
        console.warn("Skipping interceptor for refresh-token request");
        return Promise.reject(error);
      }
    }

    // If access token expired & we haven’t retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      retryCount < 1
    ) {
      originalRequest._retry = true;
      retryCount++;

      try {
        // Call refresh token endpoint
        await api.post("/users/refresh-token", {}, { withCredentials: true });
        retryCount = 0;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token expired:", refreshError.response?.data);
        retryCount = 0;
        localStorage.removeItem("auth");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    retryCount = 0;
    return Promise.reject(error);
  }
);

export default api;
