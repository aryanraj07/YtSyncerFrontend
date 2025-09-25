import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    avatar: "",
    coverImage: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUser({ ...user, [name]: files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      console.log(formData);

      Object.entries(user).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      navigate("/login");
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
    <section className="container min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-400 ">
          Register Page
        </h1>
        <form onSubmit={handleSubmit} encType="multipart/formdata">
          <div className="mb-3">
            <label
              htmlFor="username"
              className="block text-slate-400 font-medium text-sm mb-1"
            >
              Username
            </label>
            <input
              name="username"
              type="text"
              className="w-full border  focus:outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              id="username"
              value={user.username}
              onChange={handleChange}
              aria-describedby="username"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium mb-1 text-slate-400"
            >
              FullName
            </label>
            <input
              name="fullName"
              type="text"
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              id="fullName"
              value={user.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-slate-400"
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              id="email"
              value={user.email}
              onChange={handleChange}
              aria-describedby="email"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-slate-400"
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
          <div className="mb-3">
            <label
              htmlFor="avatar"
              className="fblock text-sm font-medium mb-1 text-slate-400"
            >
              Profile Avatar
            </label>
            <input
              name="avatar"
              type="file"
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              id="avatar"
              onChange={handleFileChange}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="cover-image"
              className="block text-sm font-medium mb-1 text-slate-400"
            >
              Cover Image
            </label>
            <input
              name="coverImage"
              type="file"
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              id="cover-image"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 rounded-lg py-3 font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
