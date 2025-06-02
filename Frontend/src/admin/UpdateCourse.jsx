import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCourse = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const featchCourseData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4001/api/v1/course/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(data);
        setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);
        // setImage(data.image);
        setImagePreview(data.course.image.url);
        setLoading(true);
      } catch (error) {
        console.log(error);
        toast.error("Fliled to featch course data");
        setLoading(false);
      }
    };
    featchCourseData();
  }, [id]);

  // Photo change Header
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  // Course create
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    if (image) {
      formData.append("image", image);
    }
    formData.append("imagePreview", imagePreview);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token;
    if (!token) {
      toast.error("Login admin First ");
      navigate("admin/login");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:4001/api/v1/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success(response.data.message || "Course Updated Successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setImagePreview("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gray-100 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Update Course
        </h3>

        <form onSubmit={handleUpdateCourse} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-lg">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter your course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-lg">
              Description
            </label>
            <input
              type="text"
              placeholder="Enter your course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-lg">
              Price (₹)
            </label>
            <input
              type="number"
              placeholder="Enter your course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-blue-500"
            />
          </div>

          {/* Course Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              Course Image
            </label>

            <div className="w-full flex items-center justify-center mb-4">
              <img
                src={imagePreview ? imagePreview : "/imgPL.webp"}
                alt="Course"
                className="w-full max-w-sm h-48 object-cover border border-gray-300 rounded-lg shadow-sm"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              className="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300 text-lg"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
