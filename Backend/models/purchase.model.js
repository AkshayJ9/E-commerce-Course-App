// import mongoose from "mongoose";

// const purchaseSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Types.ObjectId,
//     ref: "User", // Refer to the User model
//     required: true,
//   },
//   courseId: {
//     type: mongoose.Types.ObjectId,
//     ref: "Course", // Refer to the Course model
//     required: true,
//   },
// });

// const Purchase = mongoose.model("Purchase", purchaseSchema);
// export default Purchase;

// import mongoose from "mongoose";
// import { Course } from "./course.model.js"; // Fixed import with .js extension

// const purchaseSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     courseId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },
//     purchaseDate: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// export const Purchase = mongoose.model("Purchase", purchaseSchema);

import mongoose from "mongoose";
import { Course } from "./course.model.js";

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for formatted purchase date
purchaseSchema.virtual("formattedPurchaseDate").get(function () {
  const date = new Date(this.purchaseDate || this.createdAt);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
});

purchaseSchema.virtual("formattedPurchaseTime").get(function () {
  const date = new Date(this.purchaseDate || this.createdAt);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);
