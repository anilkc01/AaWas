import Kyc from "../models/kyc.js";
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  try {
    // The ID is now coming from the token middleware, not the URL params
    const userId = req.user.id; 

    // Fetch User and include associated Kyc data
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Kyc,
          attributes: ["id", "fullName", "address", "phone", "image", "status", "idType"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map the response to a clean structure for the frontend
    const responseData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      // Sequelize by default attaches the included model as the Model Name 
      kyc: user.Kyc ? {
        id: user.Kyc.id,
        fullName: user.Kyc.fullName,
        address: user.Kyc.address,
        image: user.Kyc.image,
        verificationStatus: user.Kyc.status,
      } : null
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};