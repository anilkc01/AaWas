import express from "express";
import { protect } from "../middleware/auth.js";
import { getKycStatus, submitKyc } from "../controllers/kycController.js";
import upload from "../middleware/uploads.js";


const router = express.Router();

router.get("/status", protect, getKycStatus);

router.post(
  "/submit",
  protect,
  upload("kyc", { field: "documentImage" }),
  submitKyc
);

export default router;



