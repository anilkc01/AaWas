import express from "express";
import { protect } from "../middleware/auth.js";
import { getUserProfile } from "../controllers/userControlller.js";
import { getRatings, submitRating } from "../controllers/ratingController.js";


const router = express.Router();

router.get("/profile/:id?", protect, getUserProfile);

router.post("/rate/:receiverId", protect, submitRating);

router.get("/rating/:userId", getRatings);

export default router;



