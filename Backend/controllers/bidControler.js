import { catchAsyncError } from "../midellware/catchAsyncError.js";
import ErrorHandler from "../midellware/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";
import mongoose from "mongoose";

/* ================= PLACE BID ================= */
export const placedItem = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { amount } = req.body;

  // 1️⃣ Find auction
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction Item not found", 404));
  }

  // 2️⃣ Check auction status
  const now = new Date();
  if (auctionItem.status === "ENDED" || now > auctionItem.endTime) {
    return next(new ErrorHandler("Auction has ended", 400));
  }

  if (!amount) {
    return next(new ErrorHandler("Please enter your bid amount", 400));
  }

  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler(
        "Bid amount must be greater than the current bid",
        400
      )
    );
  }

  if (amount < auctionItem.startingBid) {
    return next(
      new ErrorHandler(
        "Bid amount must be greater than starting bid",
        400
      )
    );
  }

  // 3️⃣ Check if user already has a bid
  const existingBid = await Bid.findOne({
    "bidder.id": req.user._id,
    auctionItem: auctionItem._id,
  });

  const existingBidInAuction = auctionItem.bids.find(
    (bid) => bid.userId.toString() === req.user._id.toString()
  );

  // 4️⃣ Update bid or create new
  if (existingBidInAuction && existingBid) {
    existingBidInAuction.amount = amount;
    existingBid.amount = amount;
    await existingBid.save();
  } else {
    const bidderDetail = await User.findById(req.user._id);
    const bid = await Bid.create({
      amount,
      bidder: {
        id: bidderDetail._id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.url,
      },
      auctionItem: auctionItem._id,
    });

    auctionItem.bids.push({
      userId: bidderDetail._id,
      userName: bidderDetail.userName,
      profileImage: bidderDetail.profileImage?.url,
      amount,
    });
  }

  // 5️⃣ Update current highest bid
  auctionItem.currentBid = amount;
  auctionItem.highestBidder = req.user._id;

  await auctionItem.save();

  res.status(201).json({
    success: true,
    message: "Bid placed successfully",
    currentBid: auctionItem.currentBid,
  });
});
