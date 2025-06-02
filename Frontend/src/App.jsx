import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";
import Courses from "./components/Courses";
import AdminSignUp from "./admin/AdminSignUp";
import AdminLogin from "./admin/AdminLogin";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";

const App = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  return (
    <>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />

        {/* Other Routes */}

        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />
        <Route
          path="purchases"
          // element={user ? <Purchases /> : <Navigate to={"/login"} />}
          element={<Purchases />}
        />

        {/* Admin Routes */}

        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard" // secure the admin dashbord
          element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />}
          // element={<Dashboard />}
        />
        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
