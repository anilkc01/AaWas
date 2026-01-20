import { Op } from "sequelize";
import { sequelize } from "../Database/database.js";
import Appointment from "../models/appointments.js";
import Bid from "../models/bids.js";
import Deal from "../models/Deal.js";
import Kyc from "../models/Kyc.js";
import Property from "../models/property.js";
import User from "../models/User.js";


/**
 * GET - Get all bids for a property with User and KYC details
 */
export const getPropertyBids = async (req, res) => {
  try {
    const { id: propertyId } = req.params;

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (!property.isBidding) {
      return res.status(400).json({
        message: "This property is not open for bidding",
      });
    }

    const bids = await Bid.findAll({
      where: { propertyId },
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "rating"],
          include: [
            {
              model: Kyc,
              attributes: ["image"], 
            },
          ],
        },
      ],
      order: [["bidAmount", "DESC"]],
    });

    res.json(bids);
  } catch (error) {
    console.error("Get bids error:", error);
    res.status(500).json({ message: "Failed to fetch bids" });
  }
};

/**
 * POST - Place a bid
 */
export const placeBid = async (req, res) => {
    console.log("caame to pace bid");
  try {
    const { id: propertyId } = req.params;
    const userId = req.user.id;
    const { bidAmount } = req.body;

    // Validate bid amount
    if (!bidAmount || bidAmount <= 0) {
      return res.status(400).json({ message: "Invalid bid amount" });
    }

    // Check if property exists and is for bidding
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.isBidding) {
      return res.status(400).json({ 
        message: 'This property is not open for bidding' 
      });
    }

    // Check if property is available
    if (property.status !== 'available') {
      return res.status(400).json({ 
        message: 'Property is not available for bidding' 
      });
    }

    // CHECK IF BIDDING IS ENABLED
    if (!property.isBidding) {
      return res.status(400).json({ message: 'This property is not open for bidding' });
    }

    // CHECK THE DEADLINE (New Logic)
    if (property.biddingEndsAt) {
      const now = new Date();
      const deadline = new Date(property.biddingEndsAt);

      if (now > deadline) {
        return res.status(400).json({ 
          message: `Bidding ended on ${deadline.toLocaleString()}. No more bids accepted.` 
        });
      }
    }

    // Get highest bid
    const highestBid = await Bid.findOne({
      where: {
        propertyId,
        status: 'active',
      },
      order: [['bidAmount', 'DESC']],
    });

    // Validate bid is higher than current highest
    if (highestBid && bidAmount <= parseFloat(highestBid.bidAmount)) {
      return res.status(400).json({ 
        message: `Bid must be higher than current highest bid of NPR ${Number(highestBid.bidAmount).toLocaleString()}` 
      });
    }

    // Check if user already has an active bid
    const existingBid = await Bid.findOne({
      where: {
        userId,
        propertyId,
        status: 'active',
      },
    });

    if (existingBid) {
      // Update existing bid
      existingBid.bidAmount = bidAmount;
      await existingBid.save();

      return res.json({
        message: 'Bid updated successfully',
        bid: existingBid,
      });
    }

    // Create new bid
    const bid = await Bid.create({
      userId,
      propertyId,
      bidAmount,
      status: 'active',
    });

    res.status(201).json({
      message: 'Bid placed successfully',
      bid,
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Failed to place bid' });
  }
};

/**
 * DELETE - Delete a bid
 */
export const deleteBid = async (req, res) => {
  try {
    const { id: bidId } = req.params;
    const userId = req.user.id;

    // Find the bid
    const bid = await Bid.findByPk(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // Check if the user owns this property
    const property = await Property.findByPk(bid.propertyId);
    if (property.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete the bid
    await bid.destroy();

    res.json({ message: "Bid deleted successfully" });
  } catch (error) {
    console.error("Delete bid error:", error);
    res.status(500).json({ message: "Failed to delete bid" });
  }
};

/**
 * POST - Book an appointment
 */
export const bookAppointment = async (req, res) => {
  try {
    const { id: propertyId } = req.params;
    const userId = req.user.id;
    const { notes } = req.body;

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.isBidding) {
      return res.status(400).json({
        message: "Cannot book appointment for bidding properties",
      });
    }

    const existingAppointment = await Appointment.findOne({
      where: {
        userId,
        propertyId,
      },
    });

    if (existingAppointment) {

      if (["pending", "confirmed", "completed"].includes(existingAppointment.status)) {
        return res.status(400).json({
          message: "You already have an active appointment for this property",
        });
      }

      if (existingAppointment.status === "cancelled") {
        existingAppointment.status = "pending";
        existingAppointment.notes = notes || existingAppointment.notes;
        await existingAppointment.save();

        return res.status(200).json({
          message: "Appointment re-booked successfully",
          appointment: existingAppointment,
        });
      }
    }

    const appointment = await Appointment.create({
      userId,
      propertyId,
      notes,
      status: 'pending',
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Book appointment error:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

/*
get all appointments for a property
*/
export const getAppointments = async (req, res) => {
  try {
    const { id: propertyId } = req.params;

    const appointments = await Appointment.findAll({
      where: { 
        propertyId,
        // Only fetch appointments that are NOT cancelled
        status: {
          [Op.ne]: "cancelled" 
        }
      },
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "rating"],
          include: [
            {
              model: Kyc,
              attributes: ["image"],
            },
          ],
        },
        {
          model: Property,
          attributes: ["id", "status", "listedFor"],
          include: [
            {
              model: Deal, 
              attributes: ["buyerId", "finalPrice"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(appointments);
  } catch (error) {
    console.error("Fetch Appointments Error:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/**
 * GET - Check if user has an appointment for a property
 */
export const checkAppointment = async (req, res) => {
  try {
    const { id: propertyId } = req.params;
    const userId = req.user.id;

    const appointment = await Appointment.findOne({
      where: {
        userId,
        propertyId,
        status: ["pending", "confirmed", "completed"],
      },
    });

    res.json({
      hasAppointment: !!appointment,
      appointment,
    });
  } catch (error) {
    console.error("Check appointment error:", error);
    res.status(500).json({ message: "Failed to check appointment" });
  }
};

/*
 Move. Appointment satus
*/
export const moveAppointment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { appointmentId } = req.body;
    const currentUserId = req.user.id; // From protect middleware

    const appointment = await Appointment.findByPk(appointmentId, {
      include: [Property],
      transaction: t
    });

    if (!appointment) {
      await t.rollback();
      return res.status(404).json({ message: "Appointment not found" });
    }

    // OWNER CHECK: Only the property creator can move the status
    if (appointment.Property.userId !== currentUserId) {
      await t.rollback();
      return res.status(403).json({ message: "You are not authorized to manage this property's appointments" });
    }

    const currentStatus = appointment.status;
    let nextStatus = currentStatus;

    if (currentStatus === "pending") {
      nextStatus = "confirmed";
    } else if (currentStatus === "confirmed") {
      nextStatus = "completed";
    } else if (currentStatus === "completed") {
      // Final step triggers the deal service
      await executeFinalizeDeal(appointment.propertyId, appointment.userId, t);
      await t.commit();
      return res.json({ 
        message: `Deal finalized! Property is now ${appointment.Property.listedFor === 'sell' ? 'Sold' : 'Rented'}.`,
        isFinalized: true 
      });
    }

    await appointment.update({ status: nextStatus }, { transaction: t });
    await t.commit();

    res.json({ 
      message: `Status moved to ${nextStatus}`, 
      isFinalized: false 
    });
  } catch (error) {
    if (t) await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE - Cancel or Remove appointment */
export const cancelAppointment = async (req, res) => {
  try {
    // 1. Get the Appointment ID from params
    const { id: appointmentId } = req.params;
    const currentUserId = req.user.id;

    // 2. Find the appointment and include the Property to check ownership
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: Property,
          attributes: ["id", "userId"], 
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // 3. Authorization Check
    const isSeeker = appointment.userId === currentUserId;
    const isOwner = appointment.Property.userId === currentUserId;

    if (!isSeeker && !isOwner) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    // 4. Update status to 'cancelled'
    appointment.status = "cancelled";
    await appointment.save();

    // 5. Custom message based on who deleted it
    const successMessage = isOwner 
      ? "Appointment removed from your list" 
      : "Your appointment has been cancelled successfully";

    return res.status(200).json({
      message: successMessage,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({
      message: "Failed to process appointment cancellation",
    });
  }
};


/*
  * POST - Finalize Deal for a Property
*/
export const finalizeDeal = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { propertyId, buyerId } = req.body;

    const deal = await executeFinalizeDeal(propertyId, buyerId, t);

    await t.commit();
    res.status(200).json({ message: "Property assigned successfully", deal });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: error.message });
  }
};

/*
To be called when owner wants to end bidding manually
*/

export const endBid = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id: propertyId } = req.params;
    const ownerId = req.user.id;

    const property = await Property.findByPk(propertyId, { transaction: t });

    if (!property) {
      await t.rollback();
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.userId !== ownerId) {
      await t.rollback();
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!property.isBidding || property.status !== 'available') {
      await t.rollback();
      return res.status(400).json({ message: "Bidding not active" });
    }

    const highestBid = await Bid.findOne({
      where: { propertyId, status: 'active' },
      order: [['bidAmount', 'DESC']],
      transaction: t
    });

    if (!highestBid) {
      await property.update({ isBidding: false }, { transaction: t });
      await t.commit();
      return res.status(200).json({ message: "Ended with no bidders" });
    }

    const deal = await executeFinalizeDeal(propertyId, highestBid.userId, t);

    await t.commit();
    res.status(200).json({ message: "Bidding ended and deal finalized", deal });

  } catch (error) {
    if (t) await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

/**
 * Service to finalize deal logic called by finalizeDeal or crron job
 */
export const executeFinalizeDeal = async (propertyId, buyerId, transaction) => {
  const property = await Property.findByPk(propertyId, { transaction });
  
  if (!property || property.status !== 'available') {
    throw new Error("Property is no longer available.");
  }

  // Determine Price: Use highest bid if bidding is on, otherwise base price
  let finalPrice = property.price;
  if (property.isBidding) {
    const winningBid = await Bid.findOne({
      where: { propertyId, userId: buyerId, status: 'active' },
      order: [['bidAmount', 'DESC']],
      transaction
    });
    if (winningBid) {
      finalPrice = winningBid.bidAmount;
      await winningBid.update({ status: 'accepted' }, { transaction });
    }
    // Reject all other bids
    await Bid.update({ status: 'rejected' }, { where: { propertyId, status: 'active' }, transaction });
  }

  // Create the Deal
  const deal = await Deal.create({
    propertyId,
    sellerId: property.userId,
    buyerId,
    finalPrice,
    dealType: property.listedFor === 'sell' ? 'sale' : 'rent'
  }, { transaction });

  // Update Property Status
  const newStatus = property.listedFor === 'sell' ? 'sold' : 'rented';
  await property.update({ status: newStatus }, { transaction });

  return deal;
};