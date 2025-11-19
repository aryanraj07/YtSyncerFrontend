import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "../styles/page/Home/HomePage.css";
import { Link, Links } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Homepage = () => {
  const { auth } = useAuth();
  return (
    <div className="hero-section flex items-center justify-center">
      <div className="hero-content flex gap-4 md:gap-8  justify-center flex-col flex-1 p-2">
        <h1 className="main-heading">
          {" "}
          Watch Youtube <br /> Together in Sync
        </h1>{" "}
        <p className="hero-subtitle">
          Create private rooms,invite friends and enjoy synced playback+chat in
          real time
        </p>
        <div className="btn-container flex items-center  justify-center lg:justify-start gap-4 w-100">
          <Link
            className="primary-btn"
            to={auth.isLoggedIn ? "/dashboard" : "/login"}
          >
            Create Room
          </Link>
          <Link className="outline-btn" to="/login">
            Login/Signup
          </Link>
        </div>
      </div>
      <div className="hero-img flex-1">
        <img src="/hero-image.png" alt="Hero Banner" loading="lazy" />
      </div>
    </div>
  );
};

export default Homepage;
