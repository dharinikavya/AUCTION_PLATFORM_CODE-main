import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const notificationSchema = new mongoose.Schema({
  message: String,
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      select: false,
    },

    address: String,
    phone: String,

    profileImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    paymentMethods: {
      bankTransfer: {
        bankAccountNumber: String,
        bankAccountIFSC: String,
        bankName: String,
      },
      phonePay: {
        phonePayNumber: Number,
      },
      paypal: {
        paypalEmail: String,
      },
    },

    role: {
      type: String,
      enum: ['Auctioner', 'Bidder', 'Super Admin'],
      required: true,
    },

    /* 💰 COMMISSION & STATS */
    unpaidCommission: {
      type: Number,
      default: 0,
    },

    auctionWon: {
      type: Number,
      default: 0,
    },

    moneySpent: {
      type: Number,
      default: 0,
    },

    /* 🏆 WON AUCTIONS (FOR BIDDER PROFILE) */
    wonAuctions: [
      {
        auction: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Auction',
        },
        bidAmount: Number,
        wonAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* 🔔 NOTIFICATIONS (POPUP SOURCE) */
    notifications: [notificationSchema],
  },
  { timestamps: true },
)

/* 🔐 PASSWORD HASH */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

/* 🔑 AUTH METHODS */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.genrateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.COOKIE_EXPIRE,
  })
}

export const User = mongoose.model('User', userSchema)
