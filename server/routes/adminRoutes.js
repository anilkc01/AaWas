import express from "express";
import { protect, requireAdmin } from "../middleware/auth.js";
import { getAdminProperties, getAdminPropertyDetail, getAdminReports, getAllUsers, getKycDetail, getKycs, getPropertyReports, getUserProfile, getUserReports, resolvePropertyReport, resolveUserReport, updateKycStatus, updatePropertyStatus, updateUserStatus } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users",protect,requireAdmin, getAllUsers);
router.get("/profile/:id?",protect,requireAdmin, getUserProfile);
router.get("/user-reports/:id",protect,requireAdmin, getUserReports);
router.patch("/user-status/:id",protect,requireAdmin, updateUserStatus);
router.patch("/user-report/:id", protect, requireAdmin, resolveUserReport);


router.post("/kycs", protect, requireAdmin, getKycs);
router.get("/kyc/:id", protect, requireAdmin, getKycDetail);
router.patch("/kyc-status/:id", protect, requireAdmin, updateKycStatus);

router.post("/properties",protect,requireAdmin, getAdminProperties);
router.get("/property/:id",protect,requireAdmin, getAdminPropertyDetail);
router.get("/property-reports/:id",protect,requireAdmin, getPropertyReports);
router.post("/reports", protect, requireAdmin, getAdminReports);
router.patch("/property/:id", protect, requireAdmin, updatePropertyStatus);
router.patch("/property-report/:id", protect, requireAdmin, resolvePropertyReport);


export default router;
