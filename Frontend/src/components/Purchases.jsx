import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCircleUser, FaDiscourse, FaDownload } from "react-icons/fa6";
import { HiMenu, HiX } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import { BACKEND_URL } from "../utils/utils";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const fetchPurchases = async () => {
      if (!token) {
        setErrorMessage("Please login to purchase the course");
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const purchasedCourses = Array.isArray(response.data.purchased)
          ? response.data.purchased
          : [];

        setPurchases(purchasedCourses);
      } catch (error) {
        console.error("Error fetching purchases:", error);
        setErrorMessage("Failed to fetch purchase data");
      }
    };

    fetchPurchases();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error in logging out", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <div className="flex items-center gap-2 py-6 mb-8 border-b border-gray-300">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl sm:text-2xl text-orange-500 font-bold">
            CourseHaven
          </h1>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-transparent
       text-black p-1 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <HiX className="text-2xl" />
        ) : (
          <HiMenu className="text-2xl" />
        )}
      </button>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 sm:p-8 bg-gray-50 transition-all duration-300 overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 mb-6 border-b border-gray-300">
          <h1 className="text-xl font-semibold whitespace-nowrap">
            My Purchases
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow sm:w-64 border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>
            {/* <FaCircleUser className="text-2xl text-blue-600 shrink-0" /> */}
          </div>
        </header>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {/* Purchased Courses */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchases
              .filter((course) =>
                (course?.title + course?.description)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                >
                  <img
                    className="rounded-lg w-full h-40 sm:h-48 object-cover mb-4"
                    src={
                      course?.image?.url || "https://via.placeholder.com/300"
                    }
                    alt={course?.title || "Course Image"}
                  />
                  <h3 className="text-lg font-bold mb-1">
                    {course?.title || "Untitled Course"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {course?.description
                      ? course.description.length > 100
                        ? `${course.description.slice(0, 100)}...`
                        : course.description
                      : "No description available"}
                  </p>
                  <span className="text-green-700 font-semibold text-sm">
                    {course?.price ? `₹${course.price}` : "Free"}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            You have no purchases yet.
          </p>
        )}
      </main>
    </div>
  );
};

export default Purchases;
