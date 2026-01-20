import User from "../models/User.js";
import { sequelize } from "../Database/database.js";
import Rating from "../models/ratings.js";

/**
 * Submit or Update a Rating
 * POST /api/users/rate/:receiverId
 */
export const submitRating = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { receiverId } = req.params;
    const reviewerId = req.user.id; // From protect middleware
    const { rating, comment } = req.body;

    if (reviewerId == receiverId) {
      return res.status(400).json({ message: "You cannot rate yourself" });
    }

    // 1. Upsert Rating: Find if a rating already exists from this reviewer to this receiver
    const [userRating, created] = await Rating.findOrCreate({
      where: { reviewerId, receiverId },
      defaults: { rating, comment },
      transaction: t,
    });

    if (!created) {
      // If it exists, replace/update it
      userRating.rating = rating;
      userRating.comment = comment;
      await userRating.save({ transaction: t });
    }

    // 2. Calculate Average Rating for the Receiver
    const allRatings = await Rating.findAll({
      where: { receiverId },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
      raw: true,
      transaction: t,
    });

    const newAverage = parseFloat(allRatings[0].avgRating).toFixed(1);

    // 3. Update the User table with the new average
    await User.update(
      { rating: newAverage },
      { where: { id: receiverId }, transaction: t }
    );

    await t.commit();
    res.status(200).json({ 
      message: created ? "Rating submitted" : "Rating updated",
      averageRating: newAverage 
    });

  } catch (error) {
    await t.rollback();
    console.error("Rating error:", error);
    res.status(500).json({ message: "Failed to process rating" });
  }
};

/**
 * Get list of ratings for a specific user
 * GET /api/users/rating/:userId
 */
export const getRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.findAll({
      where: { receiverId: userId },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["fullName"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};