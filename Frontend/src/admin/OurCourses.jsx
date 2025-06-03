import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

const OurCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;

  if (!token) {
    toast.error("Please login to Admin");
    navigate("/admin/login");
  }

  // featch the course
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Delete courses code
  const handleDeleteCourse = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updateCourses = courses.filter((course) => course._id !== id);
      setCourses(updateCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response.data.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Our Courses
        </h1>

        {/* Dashboard Link */}
        <div className="flex justify-end mb-6">
          <Link
            className="bg-orange-500 hover:bg-orange-700 transition-colors duration-300 text-white font-medium py-2 px-5 rounded-lg shadow"
            to="/admin/dashboard"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Course Image */}
              {course.image?.url && (
                <img
                  src={course?.image?.url}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                />
              )}

              {/* Course Info */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {course.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 flex-grow">
                  {course.description.length > 200
                    ? `${course.description.slice(0, 200)}...`
                    : course.description}
                </p>

                {/* Price & Buttons */}
                <div className="mt-auto">
                  {/* Price */}
                  <div className="text-lg font-bold text-gray-800 mb-3">
                    ₹{course.price}{" "}
                    <span className="text-sm text-gray-500 line-through">
                      ₹300
                    </span>
                    <div className="text-green-600 text-sm mt-1">10% off</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/update-course/${course._id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurCourses;
