import express from "express";
import { protect } from "../middleware/auth.js";
import { getUserProfile } from "../controllers/userControlller.js";


const router = express.Router();

router.get("/profile", protect, getUserProfile);

export default router;



