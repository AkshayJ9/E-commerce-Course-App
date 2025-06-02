import jwt from "jsonwebtoken";
import { config } from "../config.js"; // Using this now

function adminMiddleware(req, res, next) {
  console.log("Admin middleware called");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
    console.log("Decoded JWT:", decoded);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.error("Error in admin middleware:", error.message);
    return res.status(401).json({ errors: "Invalid token or token expired" });
  }
}

export default adminMiddleware;
