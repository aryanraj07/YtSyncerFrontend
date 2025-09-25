import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import { FaHome, FaPlus, FaSearch, FaUser, FaVideo } from "react-icons/fa";
import { GiTireIronCross } from "react-icons/gi";
import { FiMenu } from "react-icons/fi";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { auth, setAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const desktopMenu = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Chat", path: "/chat", icon: <FaUser /> },
    { name: "Watch", path: "/dashboard", icon: <FaVideo /> },
  ];

  const mobileMenu = [
    { name: "Home", path: "/", icon: <FaHome size={22} /> },
    { name: "Watch", path: "/dashboard", icon: <FaVideo size={22} /> },
    { name: "Post", path: "/create", icon: <FaPlus size={22} /> },
    { name: "Search", path: "/search", icon: <FaSearch size={22} /> },
    {
      name: auth.isLoggedIn ? "Profile" : "Login",
      path: auth.isLoggedIn ? "/profile" : "/login",
      icon: auth.isLoggedIn ? (
        <img
          src={auth.user?.avatar}
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <FaUser size={22} />
      ),
    },
  ];
  const renderLinkClass = (path) =>
    currentPath === path ? "text-teal-400" : "text-white";
  return (
    <nav className="container mx-auto flex items-center justify-between p-4 ">
      <Link className="logo text-violet-600 font-bold text-2xl" to="/">
        PlayNWatch
      </Link>

      <ul className="gap-3 items-center hidden md:flex">
        {desktopMenu.map((item) => (
          <li key={item.name} className="nav-link">
            <Link to={item.path} className={renderLinkClass(item.path)}>
              {item.name}
            </Link>
          </li>
        ))}
        <div className="relative " ref={dropdownRef}>
          {/* Avatar button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-700 transition"
          >
            {auth.isLoggedIn ? (
              <img
                src={auth?.user?.avatar}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUser size={20} />
            )}
          </button>

          {/* Dropdown menu */}
          {open && (
            <ul className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg z-50">
              {auth?.isLoggedIn ? (
                <>
                  <li className="px-4 py-2">{auth.user.username}</li>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      navigate("/dashboard");
                      setOpen(false);
                    }}
                  >
                    Dashboard
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                  >
                    Profile
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
                    onClick={() => {
                      navigate("/login");
                      setOpen(false);
                    }}
                  >
                    Login
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      navigate("/register");
                      setOpen(false);
                    }}
                  >
                    Register
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </ul>
      <button
        className="md:hidden z-2"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        {showMenu ? <GiTireIronCross size={22} /> : <FiMenu size={22} />}
      </button>
      {showMenu && (
        <ul className="flex flex-col gap-3 items-center md:hidden fixed z-1 bg-black top-0 left-0 w-full h-full p-6">
          <li className="nav-link w-full text-center">
            <Link
              to="/"
              onClick={() => setShowMenu(false)}
              className="text-white"
            >
              Home
            </Link>
          </li>
          <li className="nav-link w-full text-center">
            <Link
              to="/chat"
              onClick={() => setShowMenu(false)}
              className="text-white"
            >
              Chat
            </Link>
          </li>
          <li className="nav-link w-full text-center">
            <Link
              to="/dashboard"
              onClick={() => setShowMenu(false)}
              className="text-white"
            >
              Watch
            </Link>
          </li>
        </ul>
      )}
      <div className="fixed bottom-0 left-0 w-full  border-t border-gray-300 shadow-md flex justify-around items-center py-2 md:hidden z-20 text-violet-500">
        {mobileMenu.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center"
          >
            {item.icon}
            <span className={`text-xs ${renderLinkClass(item.path)}`}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
export default Header;
