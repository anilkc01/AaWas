import express from "express";
import { changePassword, deleteAccount, forgotPassword, loginUser, registerUser, resetPassword, verifyOTP, verifyToken } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", protect, changePassword);
router.post("/delete-account", protect, deleteAccount);
router.get("/verify", protect, verifyToken);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
