import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const LoginPage = () => {
  const { setAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", user, {
        withCredentials: true,
      });

      toast.success("User logged in successfully");
      const { user: userDetail, accessToken } = res.data?.data;
      setAuth({
        user: userDetail,
        token: accessToken,
        isLoggedIn: true,
      });
      const newAuth = {
        user: userDetail,
        token: accessToken,
        isLoggedIn: true,
      };

      localStorage.setItem("auth", JSON.stringify(newAuth));
      setTimeout(() => {
        // navigate("/dashboard");
        navigate("/");
      }, 2000);
    } catch (err) {
      console.log(err);

      console.log({
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-400">
          Login Form
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Username
            </label>
            <input
              name="username"
              type="text"
              id="username"
              value={user.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Password
            </label>
            <div className="relative ">
              <input
                name="password"
                type={`${showPassword ? "text" : "password"}`}
                id="password"
                value={user.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500  "
              />
              <div
                className="absolute right-3 bottom-3 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {!showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg  hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
