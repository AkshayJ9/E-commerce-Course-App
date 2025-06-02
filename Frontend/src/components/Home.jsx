import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import logo from "../assets/logo.webp";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.email) {
          setIsLoggedIn(true);
          setUserEmail(parsedUser.email);
        }
      } catch (error) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserEmail("");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Course fetch error:", error);
        toast.error("Failed to fetch courses");
      }
    };

    fetchCourses();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white overflow-auto">
      <div className="px-4 sm:px-8 md:px-20 lg:px-36">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center p-6 gap-4 sm:gap-0">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
            <h1 className="text-xl sm:text-2xl text-orange-500 font-bold">
              CourseHaven
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 items-center">
            {isLoggedIn && (
              <div className="text-sm text-gray-300 text-center sm:text-left w-full sm:w-auto">
                Welcome,{" "}
                <span className="text-white font-semibold">{userEmail}</span>
              </div>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-amber-400 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-amber-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-amber-400 transition"
                >
                  Signup
                </Link>
              </>
            )}

            {/* Dropdown */}
            <div className="relative">
              <input type="checkbox" id="more-toggle" className="peer hidden" />
              <label
                htmlFor="more-toggle"
                className="bg-transparent text-white py-2 px-5 border border-white rounded hover:text-amber-400 transition"
              >
                More
              </label>

              <div
                className="absolute right-0 z-10 mt-4 w-32 origin-top-right scale-95 transform rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 
               opacity-0 invisible peer-checked:opacity-100 peer-checked:visible peer-checked:scale-100 transition-all duration-150"
              >
                <Link
                  to="/admin/login"
                  className="block px-3 py-2  text-sm text-gray-700 hover:bg-gray-100"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-16 sm:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-orange-500">
            CourseHaven
          </h1>
          <p className="text-gray-400 mt-4 text-base sm:text-lg">
            Sharpen your skills with courses crafted by experts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link
              to="/courses"
              className="bg-green-500 py-3 px-6 text-white rounded font-semibold hover:bg-white hover:text-black transition duration-300"
            >
              Explore Courses
            </Link>
            <a
              href="https://www.youtube.com/@freecodecamp"
              target="_blank"
              rel="noreferrer"
              className="bg-white py-3 px-6 text-black rounded font-semibold hover:bg-green-500 hover:text-white transition duration-300"
            >
              Courses Video
            </a>
          </div>
        </section>

        {/* Courses Carousel */}
        <section className="text-center py-10">
          <Slider {...sliderSettings}>
            {courses.map((course) => (
              <div key={course._id} className="px-4">
                <div className="bg-gray-900 p-4 rounded-lg shadow-md hover:scale-105 duration-300">
                  <img
                    src={
                      course.image?.url ||
                      "https://placehold.co/300x200?text=No+Image&font=roboto"
                    }
                    alt={course.title || "Course Image"}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h2 className="text-lg font-semibold mt-2">{course.title}</h2>
                  <button className="inline-block mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-400 duration-300">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />

        {/* Footer */}
        <footer className="my-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 sm:px-16 lg:px-36">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">
                  CourseHaven
                </h1>
              </div>
              <p className="mb-2">Follow Us</p>
              <div className="flex space-x-4">
                <a href="#">
                  <FaFacebook className="text-2xl hover:text-blue-900" />
                </a>
                <a href="#">
                  <FaInstagram className="text-2xl hover:text-pink-600" />
                </a>
                <a href="#">
                  <FaTwitter className="text-2xl hover:text-blue-600" />
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-2">Connects</h3>
              <ul className="space-y-1 text-gray-400">
                <li className="hover:text-white cursor-pointer">
                  YouTube - ABC
                </li>
                <li className="hover:text-white cursor-pointer">
                  Telegram - XYZ
                </li>
                <li className="hover:text-white cursor-pointer">
                  GitHub - Akshayj9
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-2">Copyright © 2025</h3>
              <ul className="space-y-1 text-gray-400">
                <li className="hover:text-white cursor-pointer">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer">
                  Refund & Cancellation Policy
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
