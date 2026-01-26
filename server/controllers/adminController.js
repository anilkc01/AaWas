import User from "../models/User.js";
import Kyc from "../models/Kyc.js";
import { Op } from "sequelize";
import Rating from "../models/ratings.js";
import UserReport from "../models/UserReports.js";
import PropertyReport from "../models/PropertyReports.js";
import Property from "../models/property.js";
import Deal from "../models/Deal.js";
import { sequelize } from "../Database/database.js";
import { sendEmail } from "../Security/helpers.js";
import { endBid } from "./bookingsController.js";
import Appointment from "../models/appointments.js";
import Bid from "../models/bids.js";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({

      where: {
        role: {
          [Op.ne]: "admin", 
        },
      },
      
      attributes: ["id", "fullName", "email", "phone", "status"],
      
      include: [
        {
          model: Kyc,
          attributes: ["address", "status", "image"],
        },
      ],
      
      order: [["createdAt", "DESC"]],
    });

    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Admin Fetch Users Error:", error);
    res.status(500).json({ message: "Internal server error while fetching users" });
  }
};

export const getUserProfile = async (req, res) => {
  try {

    const userId = req.params.id || req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Kyc,
          attributes: ["id", "fullName", "address", "phone", "image", "status"],
        },
        {
          model: Rating,
          as: "receivedRatings",
          include: [{ model: User, as: "reviewer", attributes: ["fullName"] }],
        }
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parallel counts for the bento stats
    const [totalDeals, completedDeals, totalProperties, reportCount] = await Promise.all([
      Deal.count({ where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }] } }),
      Deal.count({ where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }], status: 'completed' } }),
      Property.count({ where: { userId } }),
      UserReport.count({ where: { reportedUserId: userId, status: 'pending' } })
    ]);

    const responseData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,  
      role: user.role,
      status: user.status,
      rating: user.rating,
      kyc: user.Kyc ? {
        image: user.Kyc.image,
        address: user.Kyc.address,
        verificationStatus: user.Kyc.status,
      } : null,
      stats: {
        totalDeals,
        completedDeals,
        totalProperties,
        reportCount
      },
      reviews: user.receivedRatings || []
    };
   
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserReports = async (req, res) => {
  try {
    const { id } = req.params;
    const reports = await UserReport.findAll({
      where: { 
        reportedUserId: id ,
        status: 'pending' 
      },
      include: [{ model: User, as: "reporter", attributes: ["fullName", "email"] }],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
};

export const resolveUserReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await UserReport.findByPk(id); // Ensure Model name matches yours

    if (!report) return res.status(404).json({ message: "Report not found" });

    await report.update({ status: "resolved" });

    return res.status(200).json({ success: true, message: "User report resolved" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ status });
    res.status(200).json({ message: `User status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status" });
  }
};



export const getKycs = async (req, res) => {
  try {
    const { status } = req.body;
    const kycs = await Kyc.findAll({
      where: { status },
      include: [{ model: User, attributes: ["id", "status"] }],
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json(kycs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching KYC list" });
  }
};


export const getKycDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const kyc = await Kyc.findByPk(id, {
      include: [{ model: User, attributes: ["id", "email", "phone", "fullName"] }],
    });
    if (!kyc) return res.status(404).json({ message: "KYC not found" });
    res.status(200).json(kyc);
  } catch (error) {
    res.status(500).json({ message: "Error fetching KYC details" });
  }
};


export const updateKycStatus = async (req, res) => {
  
  const transaction = await sequelize.transaction();
  let kycRecord;

  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    kycRecord = await Kyc.findByPk(id);
    if (!kycRecord) {
      await transaction.rollback();
      return res.status(404).json({ message: "KYC not found" });
    }

    if (status === "verified") {
      await User.update(
        { fullName: kycRecord.fullName, email: kycRecord.email, phone: kycRecord.phone },
        { where: { id: kycRecord.userId }, transaction }
      );
    }

    await kycRecord.update({ status, remarks }, { transaction });
    
    await transaction.commit();
  } catch (error) {
   
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("KYC DB Error:", error);
    return res.status(500).json({ message: "Database update failed" });
  }

  try {
    const { status, remarks } = req.body;
    const subject = status === "verified" ? "KYC Verification Approved!" : "KYC Verification Rejected";
    const message = status === "verified" 
      ? `<p>Congratulations! Your identity has been verified.  <br> You can now login using this email to place bid or list your properties</p>`
      : `<p>Your KYC was rejected. <b>Reason:</b> ${remarks}</p>`;

    await sendEmail(kycRecord.email, subject, message);
  } catch (emailError) {
    console.error("Email notification failed:", emailError);
  }

  return res.status(200).json({ message: `KYC updated successfully` });
};


export const getAdminProperties = async (req, res) => {
  try {
    const { status } = req.body; // or req.query depending on your route

    const properties = await Property.findAll({
      where: status ? { status } : {},
      attributes: [
        "id",
        "propertyType",
        "listedFor",
        "price",
        "location",
        "dpImage",
        "status",
        "isBidding",
        "updatedAt"
      ],
      include: [
        {
          model: User,
          attributes: ["id", "fullName"], // Only need name for the table
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json(properties);
  } catch (error) {
    console.error("Admin Property Fetch Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAdminPropertyDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email", "phone"],
          include: [
            {
              model: Kyc,
              attributes: ["image", "status", "address"],
            },
          ],
        },
        
      ],
    });

    if (!property) {
      return res.status(404).json({ message: "Property asset not found" });
    }

    return res.status(200).json(property);
  } catch (error) {
    console.error("Detail Fetch Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getPropertyReports = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching reports for property ID:", id);
    const reports = await PropertyReport.findAll({
      where: { 
        propertyId:id,
        status: 'pending' 
      },
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    console.log("RAW DATA FROM DB:", JSON.stringify(reports, null, 2));
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching property reports:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminReports = async (req, res) => {
  const { type, status } = req.body; // type: 'user' | 'property', status: 'pending' | 'resolved'

  try {
    if (type === "user") {
      const reports = await User.findAll({
        attributes: [
          "id", "fullName", "email", "phone", "status",
          [sequelize.fn("COUNT", sequelize.col("reportsReceived.id")), "reportCount"]
        ],
        include: [
          { model: Kyc, attributes: ["image", "status"] },
          { 
            model: UserReport, 
            as: "reportsReceived", 
            where: { status: status || "pending" },
            attributes: [] // We only want the count for the list view
          }
        ],
        group: ["User.id", "Kyc.id"],
        having: sequelize.literal(`COUNT("reportsReceived"."id") > 0`),
      });
      return res.json(reports);
    } 
    
    else {
      const reports = await Property.findAll({
        attributes: [
          "id", "propertyType", "location", "price", "dpImage", "status",
          [sequelize.fn("COUNT", sequelize.col("PropertyReports.id")), "reportCount"]
        ],
        include: [
          { model: User, attributes: ["fullName"] },
          { 
            model: PropertyReport, 
            where: { status: status || "pending" },
            attributes: [] 
          }
        ],
        group: ["Property.id", "User.id"],
        having: sequelize.literal(`COUNT("PropertyReports"."id") > 0`),
      });
      console.log("Property Reports:", reports);
      return res.json(reports);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const resolvePropertyReport = async (req, res) => {
  try {
    const { id } = req.params; 

    const report = await PropertyReport.findByPk(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.update({ status: "resolved" });

    return res.status(200).json({ 
      success: true, 
      message: "Report marked as resolved" 
    });
  } catch (error) {
    console.error("Error resolving property report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePropertyStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const property = await Property.findByPk(id, { transaction: t });
    if (!property) {
      await t.rollback();
      return res.status(404).json({ message: "Property not found" });
    }

    // --- LOGIC FOR UNAVAILABLE ---
    if (status === "unavailable") {
      if (property.isBidding) {
        // Reject all active bids
        await Bid.update(
          { status: "rejected" },
          { where: { propertyId: id, status: "active" }, transaction: t }
        );
      } else {
        // Cancel all pending/confirmed appointments
        await Appointment.update(
          { status: "cancelled" },
          { 
            where: { 
              propertyId: id, 
              status: ["pending", "confirmed"] 
            }, 
            transaction: t 
          }
        );
      }
    }

    // --- LOGIC FOR AVAILABLE ---
    if (status === "available") {
      
      if (property.isBidding) {
         // extend. 7 day if.  it was for biding
         const now = new Date();
         if (property.biddingEndsAt && property.biddingEndsAt < now) {
            const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            await property.update({ biddingEndsAt: nextWeek }, { transaction: t });
         }
      }
     
    }

    // --- LOGIC FOR SOLD OR RENTED ---
    if (status === "sold" || status === "rented") {
      if (property.isBidding) {
        endBid(id,t)
      } else {
        // Not for bidding: Cancel all appointments
        await Appointment.update(
          { status: "cancelled" },
          { 
            where: { 
              propertyId: id, 
              status: ["pending", "confirmed"] 
            }, 
            transaction: t 
          }
        );
      }
    }

    await property.update({ status }, { transaction: t });

    await t.commit();
    return res.status(200).json({ message: `Property marked as ${status}` });

  } catch (error) {
    await t.rollback();
    console.error("Error updating property status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};