import express from "express";
import { maybeProtect, protect } from "../middleware/auth.js";
import { uploadPropertyImages } from "../middleware/uploads.js";
import {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  browseProperties,
  toggleFavourite,
  reportProperty,
} from "../controllers/propertyController.js";

const router = express.Router();




// CREATE
router.post("/create", protect, uploadPropertyImages, createProperty);

// UPDATE 
router.patch("/:id", protect, uploadPropertyImages, updateProperty);

//get my properties
router.get("/my-properties", protect, getMyProperties);

//Get by ID
router.get("/browse/:id", protect, getPropertyById);

//Browse all properties except own
router.get("/browse", maybeProtect, browseProperties);

//Delete
router.delete("/:id", protect, deleteProperty);

//add Favourite
router.post("/favourite/:id", protect,toggleFavourite );

//Report Property
router.post("/report/:id", protect, reportProperty);


export default router;
