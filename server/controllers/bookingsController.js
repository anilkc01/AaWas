import Appointment from "../models/appointments.js";
import Bid from "../models/bids.js";
import Property from "../models/property.js";
import User from "../models/User.js";

/**
 * GET - Get all bids for a property
 */
export const getPropertyBids = async (req, res) => {
    console.log("came to get bids");
  try {
    const { id: propertyId } = req.params;

    // Check if property exists and is for bidding
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (!property.isBidding) {
      return res.status(400).json({
        message: "This property is not open for bidding",
      });
    }

    // Get all active bids
    
    const bids = await Bid.findAll({
      where: {
        propertyId,
        status: "active",
      },
      include: [
        {
          model: User,
          attributes: ["id", "fullName"],
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
 * POST - Book an appointment
 */
export const bookAppointment = async (req, res) => {
  try {
    const { id: propertyId } = req.params;
    const userId = req.user.id;
    const { notes } = req.body;

    // Check if property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if property is for bidding
    if (property.isBidding) {
      return res.status(400).json({
        message: "Cannot book appointment for bidding properties",
      });
    }

    // Check if user already has an appointment for this property
    const existingAppointment = await Appointment.findOne({
      where: {
        userId,
        propertyId,
        status: ["pending", "confirmed"],
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "You already have an appointment for this property",
      });
    }

    // Create appointment
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
        status: ["pending", "confirmed"],
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

/**
 * DELETE - Cancel appointment
 */
export const cancelAppointment = async (req, res) => {
  try {
    const { id: propertyId } = req.params;
    const userId = req.user.id;

    // Check if property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // Find active appointment
    const appointment = await Appointment.findOne({
      where: {
        userId,
        propertyId,
        status: ["pending", "confirmed"],
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "No active appointment found to cancel",
      });
    }

    // Update appointment status
    appointment.status = "cancelled";
    await appointment.save();

    return res.status(200).json({
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({
      message: "Failed to cancel appointment",
    });
  }
};
