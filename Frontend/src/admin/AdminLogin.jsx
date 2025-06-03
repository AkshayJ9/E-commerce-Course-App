import React, { useState, useEffect } from "react";
import logo from "../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  const navigate = useNavigate();

  // Check if admin is already logged in on component mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        if (parsedAdmin?.email && parsedAdmin?.token) {
          setIsLoggedIn(true);
          setAdminEmail(parsedAdmin.email);
        }
      } catch (error) {
        console.error("Invalid admin data in localStorage");
        // Clear corrupted data
        localStorage.removeItem("admin");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message || "Logout successful");
      localStorage.removeItem("admin");
      setIsLoggedIn(false);
      setAdminEmail("");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
      // Clear localStorage anyway in case of error
      localStorage.removeItem("admin");
      setIsLoggedIn(false);
      setAdminEmail("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("AdminLogin Response:", response.data);
      toast.success(response.data.message || "AdminLogin Successful");

      const token = response.data.token;

      if (!token) {
        console.error("No token received in AdminLogin response");
        toast.error("AdminLogin incomplete: No token received");
        return;
      }

      // Log the token for debugging
      console.log("Token received:", {
        exists: !!token,
        length: token.length,
        format: token.includes(".") ? "JWT format" : "Not JWT format",
        firstChars: token.substring(0, 10) + "...",
      });

      // Store both token and email in localStorage
      const adminData = {
        token,
        email: email, // Store the email along with token
      };
      localStorage.setItem("admin", JSON.stringify(adminData));

      // Update state to show logged in status
      setIsLoggedIn(true);
      setAdminEmail(email);

      // Clear form
      setEmail("");
      setPassword("");
      setErrorMessage("");

      // Navigate to dashboard
      navigate("/admin/dashboard");

      // Double-check storage
      const storedData = localStorage.getItem("admin");
      console.log("Verified localStorage storage:", storedData);
    } catch (error) {
      console.error("AdminLogin error:", error);

      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            error.response.data.errors ||
            "AdminLogin Failed"
        );
      } else {
        setErrorMessage("Something went wrong, please try again later.");
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

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 items-center">
            {/* Admin Welcome Message */}
            {isLoggedIn && (
              <div className="text-sm text-gray-300 text-center sm:text-left w-full sm:w-auto">
                Welcome Admin,{" "}
                <span className="text-white font-semibold">{adminEmail}</span>
              </div>
            )}

            {/* Conditional Navigation Buttons */}
            {isLoggedIn ? (
              <>
                <Link
                  to={"/admin/dashboard"}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-amber-400 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={"/admin/signup"}
                  className="text-white border border-gray-500 py-2 px-4 rounded-md hover:bg-gray-800 transition"
                >
                  SignUp
                </Link>
                <Link
                  to={"/courses"}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                  Join now
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Login Form - Only show if not logged in */}
        {!isLoggedIn ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-white">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Welcome to <span className="text-blue-500">CourseHaven</span>
              </h2>
              <p className="text-center text-gray-400 mb-6">
                Admin Login to access the dashboard!
              </p>

              <form onSubmit={handleSubmit}>
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
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="text-gray-400 block mb-2"
                  >
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
                  Login
                </button>
              </form>
            </div>
          </div>
        ) : (
          // Logged in view
          <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-white text-center">
              <h2 className="text-2xl font-bold mb-4">
                Welcome back, <span className="text-blue-500">Admin!</span>
              </h2>
              <p className="text-gray-400 mb-6">
                You are successfully logged in as: <br />
                <span className="text-white font-semibold">{adminEmail}</span>
              </p>
              <div className="space-y-3">
                <Link
                  to="/admin/dashboard"
                  className="block w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-transparent text-white py-3 px-6 border border-white rounded-md hover:text-amber-400 hover:border-amber-400 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
