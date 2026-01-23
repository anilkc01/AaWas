import User from "../models/User.js";
import Property from "../models/property.js";
import Deal from "../models/Deal.js";
import { Op } from "sequelize";
import Kyc from "../models/Kyc.js";
import Rating from "../models/ratings.js";
import UserReport from "../models/UserReports.js";

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
    const [totalDeals, completedDeals, totalProperties] = await Promise.all([
      Deal.count({ where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }] } }),
      Deal.count({ where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }], status: 'completed' } }),
      Property.count({ where: { userId } })
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
        totalProperties
      },
      reviews: user.receivedRatings || []
    };
    console.log("User Profile Data:", responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const reportUser = async (req, res) => {
  try {
    const { reportedUserId, reason, description } = req.body;
    const reporterId = req.user.id; 

    if (reporterId === parseInt(reportedUserId)) {
      return res.status(400).json({ message: "You cannot report yourself" });
    }

    const userExists = await User.findByPk(reportedUserId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserReport.create({
      reporterId,
      reportedUserId,
      reason,
      description
    });

    res.status(201).json({ message: "Report submitted successfully. We will review it shortly." });
  } catch (error) {
    console.error("Report User Error:", error);
    res.status(500).json({ message: "Failed to submit report" });
  }
};