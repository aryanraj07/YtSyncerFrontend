import React from "react";
import Swal from "sweetalert2";
import "../styles/page/Home/HomePage.css";

const Homepage = () => {
  return (
    <div className="hero-section">
      <div className="hero-content flex items-center justify-center flex-col ">
        <h1 className="hero-title text-teal-400 text-3xl font-bold md:text-6xl ">
          Watch and Connect
        </h1>
        <p>
          {" "}
          <p className="hero-subtitle">
            Stay connected with your audience in real time.
          </p>
        </p>
      </div>
      <div className="hero-img ">
        <img src="/heroBanner.png" alt="Hero Banner" loading="lazy" />
      </div>
    </div>
  );
};

export default Homepage;
