import cron from "node-cron"
import { Auction } from "../models/auctionSchema.js"
import { User } from "../models/userSchema.js"
import { Bid } from "../models/bidSchema.js"

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date()

    const endedAuctions = await Auction.find({
      endTime: { $lt: now },
      status: "ACTIVE",
    })

    for (const auction of endedAuctions) {
      try {
        const highestBid = await Bid.findOne({
          auctionItem: auction._id,
        }).sort({ amount: -1 })

        /* 🛑 NO BIDS */
        if (!highestBid) {
          auction.status = "ENDED"
          auction.commissionCalculated = true
          await auction.save()
          continue
        }

        /* 🏆 UPDATE AUCTION */
        auction.highestBidder = highestBid.userId
        auction.winningBidder = highestBid.userId
        auction.winningBidAmount = highestBid.amount
        auction.currentBid = highestBid.amount
        auction.status = "ENDED"
        auction.commissionCalculated = true
        await auction.save()

        /* ✅ ATOMIC BIDDER UPDATE (FIXED) */
        await User.findByIdAndUpdate(
          highestBid.userId,
          {
            $inc: {
              auctionWon: 1,
              moneySpent: highestBid.amount,
            },
            $push: {
              wonAuctions: {
                auction: auction._id,
                bidAmount: highestBid.amount,
              },
              notifications: {
                message: `🎉 You won "${auction.title}" with ₹${highestBid.amount}`,
                auction: auction._id,
                isRead: false,
                createdAt: new Date(),
              },
            },
          }
        )

        /* 📢 AUCTIONER NOTIFICATION */
        await User.findByIdAndUpdate(auction.createdBy, {
          $push: {
            notifications: {
              message: `🏆 Your auction "${auction.title}" ended. Winner bid: ₹${highestBid.amount}`,
              auction: auction._id,
              isRead: false,
              createdAt: new Date(),
            },
          },
        })

        console.log(`✅ Auction finalized correctly: ${auction.title}`)
      } catch (error) {
        console.error("❌ Cron error:", error)
      }
    }
  })
}
