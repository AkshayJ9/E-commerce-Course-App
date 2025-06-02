// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   email: String,
//   userId: String,
//   courseId: String,
//   paymentId: String,
//   amount: Number,
//   status: String,
// });

// export const Order = mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    amount: Number,
    email: String,
    userId: String,
    courseId: String,
    paymentId: String,
    status: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for formatted creation date
orderSchema.virtual("formattedCreatedAt").get(function () {
  const date = new Date(this.createdAt);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
});

// Virtual for formatted update time
orderSchema.virtual("formattedUpdatedAt").get(function () {
  const date = new Date(this.updatedAt);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

export const Order = mongoose.model("Order", orderSchema);
