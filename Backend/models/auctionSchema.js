import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  startingBid: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  condition: {
    type: String,
    enum: ["New", "Used"],
    required: true,
  },

  currentBid: {
    type: Number,
    default: 0,
  },

  /* 🔥 FIX: Date type (NOT String) */
  startTime: {
    type: Date,
    required: true,
  },

  endTime: {
    type: Date,
    required: true,
  },

  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  bids: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      userName: String,
      profileImage: String,
      amount: Number,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  /* 🏆 NEW: WINNER */
  winningBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  winningBidAmount: {
    type: Number,
    default: 0,
  },

  /* 🔁 Auction State */
  status: {
    type: String,
    enum: ["ACTIVE", "ENDED"],
    default: "ACTIVE",
  },

  commissionCalculated: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Auction = mongoose.model("Auction", auctionSchema);
