// import jwt from "jsonwebtoken";
// import config from "../config.js"; // Using this now

// function userMiddleware(req, res, next) {
//   console.log("User middleware called");

//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ errors: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, config.JWT_SECRET);
//     console.log("Decoded JWT:", decoded);
//     req.userId = decoded.id;
//     next();
//   } catch (error) {
//     console.error("Error in user middleware:", error.message);
//     return res.status(401).json({ errors: "Invalid token or token expired" });
//   }
// }

// export default userMiddleware;

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function userMiddleware(req, res, next) {
  console.log("User middleware called");

  const authHeader = req.headers.authorization;
  console.log("Auth header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extracted:", token ? "Token exists" : "No token");

  try {
    // Use the same secret key that was used to sign the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_USER_PASSWORD || "default_secret"
    );
    console.log("Decoded JWT:", decoded);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Error in user middleware:", error.message);
    return res.status(401).json({ errors: "Invalid token or token expired" });
  }
}

export default userMiddleware;
