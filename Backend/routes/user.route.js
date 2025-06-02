import express from "express";
import {
  login,
  logout,
  purchase,
  signUp,
} from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.mid.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.get("/purchases",userMiddleware, purchase);

export default router;
