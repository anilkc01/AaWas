import User from "../models/User.js";
import Kyc from "../models/Kyc.js";
import { Op } from "sequelize";
import Rating from "../models/ratings.js";
import UserReport from "../models/UserReports.js";
import Property from "../models/property.js";
import Deal from "../models/Deal.js";
import { sequelize } from "../Database/database.js";
import { sendEmail } from "../Security/helpers.js";


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
      UserReport.count({ where: { reportedUserId: userId } })
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
    console.log("User Profile Data:", responseData);
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
      where: { reportedUserId: id },
      include: [{ model: User, as: "reporter", attributes: ["fullName", "email"] }],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
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