import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Spinner from "../components/utils/Spinner";

const PrivateRoutes = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get("/users/check");
        if (res.status === 200) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        console.log(err);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);
  if (loading) return <Spinner />;
  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoutes;
