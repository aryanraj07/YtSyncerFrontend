import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import { FaUser } from "react-icons/fa";
import { GiTireIronCross } from "react-icons/gi";
import { FiMenu } from "react-icons/fi";
const Header = () => {
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
  return (
    <nav className="container mx-auto flex items-center justify-between p-4 ">
      <Link className="logo text-violet-600 font-bold text-2xl" to="/">
        PlayNWatch
      </Link>

      <ul className="gap-3 items-center hidden md:flex">
        <li className="nav-link">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-link">
          <Link to="/">Chat</Link>
        </li>
        <li className="nav-link">
          <Link to="/">Watch</Link>
        </li>
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
        {showMenu ? <GiTireIronCross /> : <FiMenu />}
      </button>
      {showMenu && (
        <ul className="flex flex-col gap-3 items-center md:hidden fixed z-1 bg-black top-0 left-0 w-full h-full p-6">
          <li className="nav-link">
            <Link to="/" onClick={() => setShowMenu(false)}>
              Home
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/" onClick={() => setShowMenu(false)}>
              Chat
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/" onClick={() => setShowMenu(false)}>
              Watch
            </Link>
          </li>
          <div className="relative">
            {/* Avatar button */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-700 transition"
            >
              {auth.isLoggedIn ? (
                <img
                  src={auth.user.avatar}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FaUser size={20} />
              )}
            </button>

            {/* Dropdown menu */}
            {open && (
              <ul className="absolute right-0 mt-2 w-40   rounded shadow-lg z-50">
                {auth?.isLoggedIn ? (
                  <>
                    <li className="px-4 py-2">{auth.user.username}</li>
                    <li
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        navigate("/dashboard");
                        setShowMenu(false);
                      }}
                    >
                      Dashboard
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                    >
                      Profile
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        setShowMenu(false);
                      }}
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
                        setShowMenu(false);
                      }}
                    >
                      Login
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        navigate("/register");
                        setShowMenu(false);
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
      )}
    </nav>
  );
};
export default Header;
