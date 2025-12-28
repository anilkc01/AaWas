import express from "express";
import { protect } from "../middleware/auth.js";
import { uploadPropertyImages } from "../middleware/uploads.js";
import {
  createProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

router.get("/my-properties", protect, getMyProperties);

// CREATE
router.post("/create", protect, uploadPropertyImages, createProperty);

// UPDATE 
router.patch("/:id", protect, uploadPropertyImages, updateProperty);

//Delete
router.delete("/:id", protect, deleteProperty);

export default router;
