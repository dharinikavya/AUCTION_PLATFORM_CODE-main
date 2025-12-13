import { Auction } from '../models/auctionSchema.js'
import ErrorHandler from '../midellware/error.js'
import { User } from '../models/userSchema.js'
import { Bid } from '../models/bidSchema.js'
import { v2 as cloudinary } from 'cloudinary'
import { catchAsyncError } from '../midellware/catchAsyncError.js'
import mongoose from 'mongoose'

/* ================= CREATE AUCTION ================= */
export const addNewAuctionItem = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('Auction item image required', 400))
  }

  const { image } = req.files
  const allowedFormats = ['image/png', 'image/jpeg', 'image/webp']
  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler('File format is not allowed', 401))
  }

  const {
    title,
    description,
    condition,
    startingBid,
    category,
    startTime,
    endTime,
  } = req.body

  if (
    !title ||
    !description ||
    !condition ||
    !startingBid ||
    !category ||
    !startTime ||
    !endTime
  ) {
    return next(new ErrorHandler('Please provide all details', 401))
  }

  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  if (start < now) {
    return next(
      new ErrorHandler(
        'Auction starting time must be greater than present time',
        400,
      ),
    )
  }

  if (start >= end) {
    return next(
      new ErrorHandler(
        'Auction starting time must be less than ending time',
        400,
      ),
    )
  }

  /* ===== ✅ CORRECT ACTIVE AUCTION CHECK ===== */
  const alreadyOneAuctionActive = await Auction.findOne({
    createdBy: req.user._id,
    startTime: { $lte: now },
    endTime: { $gt: now },
  })

  if (alreadyOneAuctionActive) {
    return next(
      new ErrorHandler('You already have one auction active', 400)
    )
  }

  /* ===== Upload Image ===== */
  const cloudinaryResponse = await cloudinary.uploader.upload(
    image.tempFilePath,
  )

  if (!cloudinaryResponse) {
    return next(
      new ErrorHandler('Failed to upload image to Cloudinary', 400)
    )
  }

  const auctionItem = await Auction.create({
    title,
    description,
    condition,
    startingBid,
    category,
    startTime: start,
    endTime: end,
    image: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    createdBy: req.user._id,
  })

  res.status(201).json({
    success: true,
    message: `Auction item created successfully`,
    auctionItem,
  })
})

/* ================= GET ALL AUCTIONS ================= */
export const getAllAuctionItem = catchAsyncError(async (req, res) => {
  const items = await Auction.find()
  res.status(200).json({ success: true, items })
})

/* ================= GET MY AUCTIONS ================= */
export const getMyAuctionItem = catchAsyncError(async (req, res) => {
  const items = await Auction.find({ createdBy: req.user._id })
  res.status(200).json({ success: true, items })
})

/* ================= GET AUCTION DETAILS ================= */
export const getAuctionDetails = catchAsyncError(async (req, res, next) => {
  const auctionId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return next(new ErrorHandler('Invalid ID format', 400))
  }

  const auctionItem = await Auction.findById(auctionId)

  if (!auctionItem) {
    return next(new ErrorHandler('Auction not found', 404))
  }

  const bidders = auctionItem.bids.sort((a, b) => b.amount - a.amount)

  res.status(200).json({
    success: true,
    bidders,
    auctionItem,
  })
})

/* ================= DELETE AUCTION ================= */
export const removeFromAuction = catchAsyncError(async (req, res, next) => {
  const auctionId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return next(new ErrorHandler('Invalid ID format', 400))
  }

  const auctionItem = await Auction.findById(auctionId)

  if (!auctionItem) {
    return next(new ErrorHandler('Auction not found', 404))
  }

  await auctionItem.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Auction item deleted successfully',
  })
})

/* ================= REPUBLISH AUCTION ================= */
export const republishItem = catchAsyncError(async (req, res, next) => {
  const auctionId = req.params.id
  const { startTime, endTime } = req.body

  if (!startTime || !endTime) {
    return next(new ErrorHandler('StartTime and EndTime are required', 400))
  }

  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    return next(new ErrorHandler('Invalid ID format', 400))
  }

  let auctionItem = await Auction.findById(auctionId)

  if (!auctionItem) {
    return next(new ErrorHandler('Auction not found', 404))
  }

  if (new Date(auctionItem.endTime) > new Date()) {
    return next(
      new ErrorHandler('Auction is already active, cannot republish', 400),
    )
  }

  const newStartTime = new Date(startTime)
  const newEndTime = new Date(endTime)

  auctionItem = await Auction.findByIdAndUpdate(
    auctionId,
    {
      startTime: newStartTime,
      endTime: newEndTime,
      bids: [],
      currentBid: 0,
      highestBidder: null,
    },
    { new: true },
  )

  await Bid.deleteMany({ auctionItem: auctionItem._id })

  res.status(200).json({
    success: true,
    message: 'Auction republished successfully',
  })
})
