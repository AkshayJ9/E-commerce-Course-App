import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { RiAdminFill, RiAiGenerateText, RiHome2Fill } from "react-icons/ri";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.webp";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/utils";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  return (
    <>
      {/* Dashboard */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isDashboardOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <div className="flex items-center gap-2 py-6 mb-8 border-b border-gray-300">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl sm:text-2xl text-orange-500 font-bold">
            CourseHaven
          </h1>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold mx-12 my-9 text-center">
          I'm Admin
        </h1>
        <nav>
          <ul>
            <li className="mb-4">
              <Link
                to="/admin/our-courses"
                className="flex items-center bg-green-600 text-white p-2 rounded-md justify-center"
              >
                <RiAdminFill className="mr-2" /> OurCourses
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/admin/create-course"
                className="flex items-center bg-orange-600 text-white p-2 rounded-md justify-center"
              >
                <RiAiGenerateText className="mr-2" /> Create Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/"
                className="flex items-center bg-red-600 text-white p-2 rounded-md justify-center"
              >
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>

            <li>
              {isLoggedIn ? (
                <div
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer bg-yellow-600 text-white p-2 rounded-md justify-center"
                >
                  <IoLogOut className="mr-2 " /> Logout
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center bg-yellow-600 text-white p-2 rounded-md justify-center"
                >
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Toggle Button (mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-transparent text-black p-1 rounded-lg"
        onClick={toggleDashboard}
      >
        {isDashboardOpen ? (
          <HiX className="text-2xl" />
        ) : (
          <HiMenu className="text-2xl" />
        )}
      </button>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome 👋</h1>
          <p className="text-gray-600 text-base">
            We’re glad to have you here. Explore our platform and enjoy the
            experience.
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
