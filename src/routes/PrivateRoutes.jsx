// PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/users/check", { withCredentials: true }); // backend endpoint jo sirf logged-in user ke liye chale
        setIsAuth(true);
      } catch (err) {
        console.log(err.name);
        console.log(err.stack);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
}
