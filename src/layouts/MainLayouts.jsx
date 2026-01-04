import React from "react";
import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import Footer from "../components/footer/Footer";
const MainLayouts = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <ToastContainer
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayouts;
