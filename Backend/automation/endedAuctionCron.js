import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();

    const endedAuctions = await Auction.find({
      endTime: { $lt: now },
      status: "ACTIVE",
    });

    for (const auction of endedAuctions) {
      try {
        const highestBid = await Bid.findOne({
          auctionItem: auction._id,
        }).sort({ amount: -1 });

        /* 🛑 NO BIDS */
        if (!highestBid) {
          auction.status = "ENDED";
          auction.commissionCalculated = true;
          await auction.save();
          continue;
        }

        /* ✅ CORRECT ID EXTRACTION */
        const bidderId = highestBid.bidder.id; // 🔥 THIS WAS THE BUG
        const bidder = await User.findById(bidderId);
        const auctioner = await User.findById(auction.createdBy);

        if (!bidder || !auctioner) {
          console.error("❌ Bidder or Auctioner not found");
          continue;
        }

        /* 🏆 UPDATE AUCTION */
        auction.highestBidder = bidder._id;
        auction.winningBidder = bidder._id;
        auction.winningBidAmount = highestBid.amount;
        auction.currentBid = highestBid.amount;
        auction.status = "ENDED";
        auction.commissionCalculated = true;
        await auction.save();

        /* 📊 UPDATE BIDDER */
        bidder.auctionWon += 1;
        bidder.moneySpent += highestBid.amount;

        bidder.wonAuctions.push({
          auction: auction._id,
          bidAmount: highestBid.amount,
        });

        bidder.notifications.push({
          message: `🎉 You won the auction "${auction.title}"`,
          auction: auction._id,
        });

        await bidder.save();

        /* 📢 AUCTIONER NOTIFICATION */
        auctioner.notifications.push({
          message: `🏆 Your auction "${auction.title}" ended. Winner: ${bidder.userName} (₹${highestBid.amount})`,
          auction: auction._id,
        });

        await auctioner.save();

        console.log(`✅ Auction finalized successfully: ${auction.title}`);
      } catch (error) {
        console.error("❌ Cron error:", error.message);
      }
    }
  });
};
