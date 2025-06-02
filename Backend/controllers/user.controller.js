import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
// import { config } from "dotenv";
import dotenv from "dotenv";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js"; // Fixed import with .js extension
dotenv.config();

// User Regisration
export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body || {};

  // Server-side validation using Zod
  const userSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "FirstName must be at least 6 characters long" }),

    lastName: z
      .string()
      .min(3, { message: "LastName must be at least 2 characters long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  });

  const validateData = userSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ errors: validateData.error.issues.map((err) => err.message) });
  }

  // hide password in response
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exists" });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User Created Successfully", newUser });
  } catch (error) {
    res.status(500).json({ errors: "Error in user creation" });
    console.log("Error in user creation", error);
  }
};

// User Login
export const login = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    const user = await User.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_USER_PASSWORD || "default_secret",
      { expiresIn: "1d" }
    );
    const cookieOptions = {
      expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true, //can't be accesed via js directly
      secure: process.env.NODE_ENV === "production", // true for https only
      sameSite: "Strict", // CSRF Attacks
    };

    res.status(201).json({ message: "Login Successful", user, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in user login" });
    console.log("Error in user login", error);
  }
};

// User Logout
export const logout = (req, res) => {
  try {
    if (!req.cookies) {
      return res.status(401).json({ errors: "Kindly login first" });
    }

    res.clearCookie("jwt");
    res.status(200).json({ message: "User Logged Out Successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in user logout" });
    console.log("Error in user logout", error);
  }
};
export const purchase = async (req, res) => {
  const userId = req.userId;

  try {
    const purchasedRecords = await Purchase.find({ userId });

    const courseIds = purchasedRecords.map((record) => record.courseId);

    const courses = await Course.find({ _id: { $in: courseIds } });

    res.status(200).json({ purchased: courses });
  } catch (error) {
    console.error("Error in Purchase", error);
    res.status(500).json({ errors: "Error in Purchase" });
  }
};
