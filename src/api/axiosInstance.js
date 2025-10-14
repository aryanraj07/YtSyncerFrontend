// axiosInstance.js
import axios from "axios";
import { getAuth, setAuth } from "../context/authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url.includes("/users/refresh-token")) {
      {
        console.warn("Skipping interceptor for refresh-token request");
        return Promise.reject(error);
      }
    }

    // If access token expired & we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        await api.post("/users/refresh-token", {}, { withCredentials: true });

        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token expired:", refreshError.response?.data);

        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
  }
);

export default api;
