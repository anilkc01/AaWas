import express from "express";
import { protect, requireAdmin } from "../middleware/auth.js";
import { getAllUsers, getKycDetail, getKycs, getUserProfile, getUserReports, updateKycStatus, updateUserStatus } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users",protect,requireAdmin, getAllUsers);
router.get("/profile/:id?",protect,requireAdmin, getUserProfile);
router.get("/reports/:id",protect,requireAdmin, getUserReports);
router.patch("/user-status/:id",protect,requireAdmin, updateUserStatus);


router.post("/kycs", protect, requireAdmin, getKycs);
router.get("/kyc/:id", protect, requireAdmin, getKycDetail);
router.patch("/kyc-status/:id", protect, requireAdmin, updateKycStatus);


export default router;
