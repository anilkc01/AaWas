import cron from 'node-cron';
import { Op } from 'sequelize';
import { executeFinalizeDeal } from '../controllers/bookingsController.js';
import Property from '../models/property.js';
import { sequelize } from '../Database/database.js';
import Bid from '../models/bids.js';


cron.schedule('* * * * *', async () => {
  try {
    const expiredProperties = await Property.findAll({
      where: {
        isBidding: true,
        status: 'available',
        biddingEndsAt: { [Op.lt]: new Date() }
      }
    });

    for (const property of expiredProperties) {
      const t = await sequelize.transaction();
      try {
        // Find the highest bidder
        const topBid = await Bid.findOne({
          where: { propertyId: property.id, status: 'active' },
          order: [['bidAmount', 'DESC']],
          transaction: t
        });

        if (topBid) {
          // CALLS THE SAME SERVICE LOGIC
          await executeFinalizeDeal(property.id, topBid.userId, t);
          console.log(`Cron: Finalized Property ${property.id} to highest bidder ${topBid.userId}`);
        } else {
          // Close bidding but stay available if no bids were found
          await property.update({ isBidding: false }, { transaction: t });
        }
        await t.commit();
      } catch (err) {
        await t.rollback();
        console.error(`Cron error on property ${property.id}:`, err.message);
      }
    }
  } catch (globalErr) {
    console.error("Global Cron Error:", globalErr);
  }
});