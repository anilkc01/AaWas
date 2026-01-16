import express from "express";
import { bookAppointment, cancelAppointment, checkAppointment, getPropertyBids, placeBid } from "../controllers/bookingsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/appointment/:id",protect, bookAppointment);
router.get("/appointment/:id",protect, checkAppointment);
router.delete("/appointment/:id", protect, cancelAppointment);

router.post("/bid/:id",protect, placeBid);
router.get("/bids/:id",protect, getPropertyBids);

export default router;