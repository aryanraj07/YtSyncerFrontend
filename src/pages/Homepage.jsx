import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "../styles/page/Home/HomePage.css";

const Homepage = () => {
  return (
    <div className="hero-section flex items-center justify-center">
      <div className="hero-content flex gap-4 md:gap-8  justify-center flex-col ">
        <h1 className="main-heading">
          {" "}
          Watch Youtube <br /> Together in Sync
        </h1>{" "}
        <p className="hero-subtitle">
          Create private rooms,invite friends and enjoy synced playback+chat in
          real time
        </p>
        <div className="btn-container flex items-center  justify-center md:justify-start gap-4 w-100">
          <button className="primary-btn">Create Room</button>
          <button className="outline-btn">Login/Signup</button>
        </div>
      </div>
      <div className="hero-img ">
        <img src="/hero-image.png" alt="Hero Banner" loading="lazy" />
      </div>
    </div>
  );
};

export default Homepage;
