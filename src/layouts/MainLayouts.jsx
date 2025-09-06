import React from "react";
import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { ToastContainer } from "react-toastify";

const MainLayouts = () => {
  return (
    <AuthProvider>
      <SocketProvider>
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
      </SocketProvider>
    </AuthProvider>
  );
};

export default MainLayouts;
