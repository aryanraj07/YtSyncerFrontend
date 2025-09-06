import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import { FaUser } from "react-icons/fa";
const Header = () => {
  const { auth, setAuth } = useAuth();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setAuth({ user: null, auth: null, isLoggedIn: false });
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <nav className="container mx-auto flex items-center justify-between p-4 ">
      <div className="logo text-violet-600 font-bold text-2xl">Chat App</div>

      <ul className="flex gap-3 items-center">
        <li className="nav-link">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-link">
          <Link to="/">Chat</Link>
        </li>
        <li className="nav-link">
          <Link to="/">Watch</Link>
        </li>
        <div className="relative">
          {/* Avatar button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-700 transition"
          >
            <FaUser size={20} />
          </button>

          {/* Dropdown menu */}
          {open && (
            <ul className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg z-50">
              {auth?.isLoggedIn ? (
                <>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </>
              ) : (
                <>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </ul>
    </nav>
  );
};
export default Header;
