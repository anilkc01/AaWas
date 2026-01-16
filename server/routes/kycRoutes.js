import express from "express";
import { protect } from "../middleware/auth.js";
import { getKycStatus, submitKyc } from "../controllers/kycController.js";
import { uploadKycImages } from "../middleware/uploads.js";


const router = express.Router();

router.get("/status", protect, getKycStatus);

router.post("/submit", protect, uploadKycImages, submitKyc);

export default router;



