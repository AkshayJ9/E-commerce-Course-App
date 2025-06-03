import React, { useState } from "react";
import logo from "../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

const AdminSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("All fields are required");
      return;
    }

    console.log("Submitted values:", { firstName, lastName, email, password });

    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/signup`,
        { firstName, lastName, email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("AdminSignUp Successful:", response.data);
      toast.success(response.data.message || "AdminSignUp Successful");
      navigate("/admin/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "AdminSignUp Failed");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="w-full flex flex-col sm:flex-row justify-between items-center py-4">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-xl font-bold text-blue-500">
              CourseHaven
            </Link>
          </div>
          <div className="flex gap-3">
            <Link
              to={"/admin/login"}
              className="text-white border border-gray-500 py-2 px-4 rounded-md hover:bg-gray-800 transition"
            >
              Login
            </Link>
            <Link
              to={"/courses"}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* AdminSignUp Form */}
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Welcome to <span className="text-blue-500">CourseHaven</span>
            </h2>
            <p className="text-center text-gray-400 mb-6">
              Just AdminSignUp To Join Us!
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="firstName" className="text-gray-400 block mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your firstName"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="lastName" className="text-gray-400 block mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your lastName"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="text-gray-400 block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="name1@gmail.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="text-gray-400 block mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="*********"
                  />
                  <span
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>
              {errorMessage && (
                <div className="mb-4 text-red-500 text-center">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition cursor-pointer"
              >
                SignUp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;
