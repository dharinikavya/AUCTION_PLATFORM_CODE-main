import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../midellware/error.js";
import { catchAsyncError } from "../midellware/catchAsyncError.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

/* ================= CREATE AUCTION ================= */
export const addNewAuctionItem = catchAsyncError(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return next(new ErrorHandler("Auction item image required", 400));
  }

  const { image } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("File format is not allowed", 400));
  }

  const { title, description, condition, startingBid, category, startTime, endTime } = req.body;

  if (!title || !description || !condition || !startingBid || !category || !startTime || !endTime) {
    return next(new ErrorHandler("Please provide all details", 400));
  }

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start < now) {
    return next(new ErrorHandler("Auction starting time must be in the future", 400));
  }

  if (start >= end) {
    return next(new ErrorHandler("Auction start time must be before end time", 400));
  }

  const activeAuction = await Auction.findOne({
    createdBy: req.user._id,
    startTime: { $lte: now },
    endTime: { $gt: now },
  });

  if (activeAuction) {
    return next(new ErrorHandler("You already have an active auction", 400));
  }

  const cloudRes = await cloudinary.uploader.upload(image.tempFilePath);

  const auctionItem = await Auction.create({
    title,
    description,
    condition,
    startingBid,
    category,
    startTime: start,
    endTime: end,
    image: { public_id: cloudRes.public_id, url: cloudRes.secure_url },
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Auction created successfully",
    auctionItem,
  });
});

/* ================= GET ALL AUCTIONS ================= */
export const getAllAuctionItem = catchAsyncError(async (req, res) => {
  const items = await Auction.find().sort({ startTime: -1 });
  res.status(200).json({ success: true, items });
});

/* ================= GET MY AUCTIONS ================= */
export const getMyAuctionItem = catchAsyncError(async (req, res) => {
  const items = await Auction.find({ createdBy: req.user._id }).sort({ startTime: -1 });
  res.status(200).json({ success: true, items });
});

/* ================= GET AUCTION DETAILS ================= */
export const getAuctionDetails = catchAsyncError(async (req, res, next) => {
  const auctionId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return next(new ErrorHandler("Invalid ID format", 400));
  }

  const auctionItem = await Auction.findById(auctionId);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found", 404));
  }

  const bidders = auctionItem.bids.sort((a, b) => b.amount - a.amount);

  res.status(200).json({ success: true, auctionItem, bidders });
});

/* ================= DELETE AUCTION (ENDED ONLY) ================= */
export const removeFromAuction = catchAsyncError(async (req, res, next) => {
  const auctionId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return next(new ErrorHandler("Invalid ID format", 400));
  }

  const auctionItem = await Auction.findById(auctionId);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found", 404));
  }

  if (auctionItem.status !== "ENDED") {
    return next(new ErrorHandler("Cannot delete an active auction", 400));
  }

  if (!req.user._id.equals(auctionItem.createdBy) && req.user.role !== "Super Admin") {
    return next(new ErrorHandler("You are not authorized to delete this auction", 403));
  }

  await auctionItem.deleteOne();

  res.status(200).json({
    success: true,
    message: "Ended auction deleted successfully",
  });
});

/* ================= REPUBLISH AUCTION ================= */
export const republishItem = catchAsyncError(async (req, res, next) => {
  const auctionId = req.params.id;
  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    return next(new ErrorHandler("StartTime and EndTime are required", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return next(new ErrorHandler("Invalid ID format", 400));
  }

  let auctionItem = await Auction.findById(auctionId);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found", 404));
  }

  if (auctionItem.status === "ACTIVE") {
    return next(new ErrorHandler("Auction is still active, cannot republish", 400));
  }

  const newStartTime = new Date(startTime);
  const newEndTime = new Date(endTime);

  auctionItem = await Auction.findByIdAndUpdate(
    auctionId,
    {
      startTime: newStartTime,
      endTime: newEndTime,
      bids: [],
      currentBid: 0,
      highestBidder: null,
      winningBidder: null,
      winningBidAmount: 0,
      status: "ACTIVE",
    },
    { new: true }
  );

  await Bid.deleteMany({ auctionItem: auctionItem._id });

  res.status(200).json({
    success: true,
    message: "Auction republished successfully",
    auctionItem,
  });
});

/* ================= FINALIZE AUCTIONS ================= */
export const finalizeAuction = catchAsyncError(async (req, res, next) => {
  const now = new Date();
  const auctions = await Auction.find({ endTime: { $lte: now }, status: "ACTIVE" });

  for (const auction of auctions) {
    auction.status = "ENDED";

    if (auction.highestBidder) {
      auction.winningBidder = auction.highestBidder;
      auction.winningBidAmount = auction.currentBid;

      await User.findByIdAndUpdate(auction.highestBidder, {
        $inc: { moneySpent: auction.currentBid, auctionWon: 1 },
      });

      // Optional: send notification to winner (pseudo-code)
      // sendNotification(auction.highestBidder, `You won auction ${auction.title}`);
    }

    await auction.save();
  }

  res.status(200).json({
    success: true,
    message: "Auctions finalized successfully",
  });
});
