// import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
// import { Purchase } from "../models/purchase.model.js";
// import { config } from "../config.js";

// Create Course
export const createCourse = async (req, res) => {
  const adminId = req.adminId; // adminId from middleware (admin.mid.js)
  const { title, description, price } = req.body || {};

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ errors: "No image file uploaded" });
    }

    const image = req.files.image;

    const allowedFormat = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({
        errors: "Invalid image format. Only png, jpg, jpeg are allowed",
      });
    }

    // Upload image to Cloudinary
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);

    if (!cloud_response || !cloud_response.secure_url) {
      return res.status(400).json({ errors: "Error uploading to Cloudinary" });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url,
      },
      creatorId: adminId,
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      message: "Course Created Successfully",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ errors: "Error creating course" });
  }
};

// // Update Course
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;
  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
      }
    );
    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't update, created by other admin" });
    }
    res.status(201).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ errors: "Error in course updating" });
    console.log("Error in course updating ", error);
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ errors: "Can't delete created by other admin" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error deleting course" });
    console.log("Error in course deletion", error);
  }
};

// Get All Courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting all courses" });
    console.log("Error in getting all courses", error);
  }
};

// Get Course Details
export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting course details" });
    console.log("Error in getting course details", error);
  }
};

// Buy Courses
import Stripe from "stripe";
import { config, STRIPE_SECRET_KEY } from "../config.js";
// Import necessary models
import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { User } from "../models/user.model.js";

// Ensure that the Stripe secret key is available
if (!STRIPE_SECRET_KEY) {
  console.error("Stripe secret key is missing in configuration.");
  process.exit(1);
}

// Initialize Stripe with the provided secret key and a specific API version
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    // Retrieve the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ errors: "User not found" });
    }

    const email = user.email; // Extract email

    // Find the course based on the provided courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    // Check if the purchase already exists for this user/course
    const existingPurchase = await Purchase.findOne({
      userId,
      courseId,
    });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    // Convert course price to the smallest currency unit (cents for USD)
    const amountInCents = course.price * 100;

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "INR", // Change to your desired currency
      description: `Purchase of course: ${course.title}`,

      payment_method_types: ["card"],
    });

    // For demonstration: Immediately create a Purchase record.
    // Note: In a real-world scenario, you would typically create the purchase record
    // only after confirming that the payment has been successfully completed via a webhook.
    const newPurchase = await Purchase.create({
      userId,
      courseId,
      email,
      purchaseDate: new Date(),
    });

    // Respond with course information, client secret for further confirmation,
    // and the new purchase record so that the UI can update accordingly.
    res.status(201).json({
      message: "Course purchased successfully",
      course,
      purchase: newPurchase,
      clientSecret: paymentIntent.client_secret,
      userEmail: email,
    });
  } catch (error) {
    console.error("Error in course buying:", error);
    res.status(500).json({ errors: "Error in course buying" });
  }
};

// Buy Courses
// export const buyCourses = async (req, res) => {
//   console.log("buyCourses called");
//   const { userId } = req; // userId from middleware (user.mid.js)
//   const { courseId } = req.params;

//   try {
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ errors: "Course not found" });
//     }
//     const existingPurchase = await Purchase.findOne({
//       userId: userId,
//       courseId: courseId,
//     });
//     if (existingPurchase) {
//       return res
//         .status(400)
//         .json({ errors: "User has already purchased this course" });
//     }
//     const newPurchase = new Purchase({
//       userId: userId,
//       courseId: courseId,
//     });
//     await newPurchase.save();
//     res
//       .status(201)
//       .json({ message: "Course purchased successfully", newPurchase });
//   } catch (error) {
//     console.log("Error in buying course", error);
//     res.status(500).json({ errors: "Error in buying course" });
//   }
// };
