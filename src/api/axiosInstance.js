// axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1", // your backend URL
  withCredentials: true, // ✅ important so cookies get sent
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(
      "❌ Axios error:",
      error.response?.status,
      error.response?.data
    );
    // If access token expired & we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("🔄 Trying refresh token...");
      try {
        // Call refresh token endpoint
        await api.post("/auth/refresh-token");
        console.log("✅ Refresh token success, retrying original request");

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired. Please login again.");
        console.error("❌ Refresh token expired:", refreshError.response?.data);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
