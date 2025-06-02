import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const orderData = async (req, res) => {
  const order = req.body;
  console.log("Order data: ", order);

  try {
    const orderInfo = await Order.create(order);
    console.log("Order saved:", orderInfo);

    const userId = orderInfo?.userId;
    const email = orderInfo?.email;
    const courseId = orderInfo?.courseId;

    // ✅ Save purchase record only after successful order
    if (userId && courseId && email) {
      await Purchase.create({ userId, courseId, email });
      console.log("Purchase created");
    }

    res.status(201).json({ message: "Order saved", orderInfo });
  } catch (error) {
    console.log("Error in order: ", error);
    res.status(500).json({ errors: "Error in order creation" });
  }
};
