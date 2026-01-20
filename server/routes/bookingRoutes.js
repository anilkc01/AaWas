import express from "express";
import { bookAppointment, 
    cancelAppointment, 
    checkAppointment, 
    deleteBid, endBid, 
    getAppointments, 
    getPropertyBids, 
    placeBid, 
    moveAppointment } from "../controllers/bookingsController.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

router.post("/appointment/:id",protect, bookAppointment);
router.get("/appointment/:id",protect, checkAppointment);
router.get("/appointments/:id",protect, getAppointments);
router.delete("/appointment/:id", protect, cancelAppointment);
router.put("/appointment/move", protect, moveAppointment);

router.post("/bid/:id",protect, placeBid);
router.get("/bids/:id",protect, getPropertyBids);
router.delete("/bid/:id",protect, deleteBid);
router.post("/end-bid/:id",protect, endBid);

export default router;