import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import dotenv from "dotenv";
import { Admin } from "../models/admin.model.js";
dotenv.config();

// Admin Regisration
export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body || {};

  // Server-side validation using Zod
  const adminSchema = z.object({
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

  const validateData = adminSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ errors: validateData.error.issues.map((err) => err.message) });
  }

  // hide password in response
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if Admin already exists
  try {
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      return res.status(400).json({ errors: "Admin already exists" });
    }
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin Created Successfully", newAdmin });
  } catch (error) {
    res.status(500).json({ errors: "Error in Admin creation" });
    console.log("Error in Admin creation", error);
  }
};

// Admin Login
export const login = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    const admin = await Admin.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!admin || !isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_ADMIN_PASSWORD || "default_secret",
      { expiresIn: "1d" }
    );
    const cookieOptions = {
      expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true, //can't be accesed via js directly
      secure: process.env.NODE_ENV === "production", // true for https only
      sameSite: "Strict", // CSRF Attacks
    };

    res.status(201).json({ message: "Login Successful", admin, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in Admin login" });
    console.log("Error in Admin login", error);
  }
};

// Admin Logout
export const logout = async (req, res) => {
  try {
    if (!req.cookies) {
      return res.status(401).json({ errors: "Kindly Login First" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Admin Logged Out Successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in Admin logout" });
    console.log("Error in Admin logout", error);
  }
};
