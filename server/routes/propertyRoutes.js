import express from "express";
import { protect } from "../middleware/auth.js";
import { uploadPropertyImages } from "../middleware/uploads.js";
import {
  createProperty,
  getMyProperties,
} from "../controllers/propertyController.js";

const router = express.Router();

router.get("/my-properties", protect, getMyProperties);

// Single middleware handles both dpImage and images
router.post("/create", protect, uploadPropertyImages, createProperty);

export default router;