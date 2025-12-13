import cron from 'node-cron'
import { Auction } from '../models/auctionSchema.js'
import { User } from '../models/userSchema.js'
import { Bid } from '../models/bidSchema.js'
import { calculateCommission } from '../controllers/commissionControler.js'

export const endedAuctionCron = () => {
  cron.schedule('*/1 * * * *', async () => {
    const now = new Date()

    const endedAuctions = await Auction.find({
      endTime: { $lt: now },
      commissionCalculated: false,
      status: 'ACTIVE',
    })

    for (const auction of endedAuctions) {
      try {
        const commissionAmount = await calculateCommission(auction._id)

        const highestBid = await Bid.findOne({
          auctionItem: auction._id,
        }).sort({ amount: -1 })

        const auctioner = await User.findById(auction.createdBy)

        if (!highestBid) {
          // No bids, just mark auction as ended
          auction.status = 'ENDED'
          auction.commissionCalculated = true
          await auction.save()
          continue
        }

        const bidder = await User.findById(highestBid.bidder)

        // Update Auction
        auction.highestBidder = bidder._id
        auction.winningBidder = bidder._id
        auction.winningBidAmount = highestBid.amount
        auction.currentBid = highestBid.amount
        auction.status = 'ENDED'
        auction.commissionCalculated = true
        await auction.save()

        // Update Bidder Profile
        bidder.auctionWon += 1
        bidder.moneySpent += highestBid.amount
        bidder.wonAuctions.push({
          auction: auction._id,
          bidAmount: highestBid.amount,
        })
        bidder.notifications.push({
          message: `🎉 You won "${auction.title}" with ₹${highestBid.amount}`,
          auction: auction._id,
        })
        await bidder.save()

        // Notify Auctioner
        auctioner.unpaidCommission += commissionAmount
        auctioner.notifications.push({
          message: `🏆 Your auction "${auction.title}" ended. Winner: ${bidder.userName} (₹${highestBid.amount})`,
          auction: auction._id,
        })
        await auctioner.save()

        console.log(`✅ Auction processed: ${auction.title}`)
      } catch (error) {
        console.error('❌ Error in ended auction cron:', error.message)
      }
    }
  })
}
