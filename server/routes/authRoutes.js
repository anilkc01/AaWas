import express from "express";
import { changePassword, deleteAccount, loginUser, registerUser, verifyToken } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", protect, changePassword);
router.post("/delete-account", protect, deleteAccount);
router.get("/verify", protect, verifyToken);


export default router;
