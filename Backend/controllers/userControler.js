import { catchAsyncError } from '../midellware/catchAsyncError.js'
import ErrorHandler from '../midellware/error.js'
import { User } from '../models/userSchema.js'
import cloudinary from 'cloudinary'
import { genrateToken } from '../utils/jwtToken.js'

/* ================= REGISTER ================= */
export const register = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('Profile image required...', 400))
  }

  const { profileImage } = req.files
  const allowedFormats = ['image/png', 'image/jpeg', 'image/webp']

  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler('File format is not allowed', 401))
  }

  const {
    userName,
    password,
    email,
    address,
    role,
    phone,
    backAccountNumber,
    backAccountIFSC,
    bankName,
    PhonePayNumber,
    paypalEmail,
  } = req.body

  if (!userName || !password || !email || !address || !role || !phone) {
    return next(new ErrorHandler('Please fill full form', 401))
  }

  if (role === 'Auctioner') {
    if (!backAccountIFSC || !backAccountNumber || !bankName) {
      return next(new ErrorHandler('Please provide bank details', 400))
    }
    if (!PhonePayNumber) {
      return next(new ErrorHandler('Please provide PhonePay number', 400))
    }
    if (!paypalEmail) {
      return next(new ErrorHandler('Please provide PayPal email', 400))
    }
  }

  const isRegister = await User.findOne({ email })
  if (isRegister) {
    return next(new ErrorHandler('User already exists with this email', 400))
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath
  )

  if (!cloudinaryResponse) {
    return next(new ErrorHandler('Cloudinary upload failed', 400))
  }

  const user = await User.create({
    userName,
    password,
    email,
    address,
    role,
    phone,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    paymentMethods: {
      bankTransfer: {
        backAccountNumber,
        backAccountIFSC,
        bankName,
      },
      phonePay: {
        PhonePayNumber,
      },
      paypal: {
        paypalEmail,
      },
    },
  })

  genrateToken(user, 'User registered successfully', 201, res)
})

/* ================= LOGIN ================= */
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler('Provide all details', 400))
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    return next(new ErrorHandler('Password is incorrect', 401))
  }

  genrateToken(user, 'User login successfully', 200, res)
})

/* ================= LOGOUT ================= */
export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie('token', '', { maxAge: 0 }).status(200).json({
    success: true,
    message: 'User logged out successfully',
  })
})

/* ================= USER PROFILE ================= */
export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id)

  res.status(200).json({
    success: true,
    user,
  })
})

/* ================= LEADERBOARD (✅ FIXED) ================= */
export const fetchLeaderboard = catchAsyncError(async (req, res, next) => {
  const leaderboard = await User.find({ moneySpent: { $gt: 0 } })
    .sort({ moneySpent: -1 })
    .select('userName moneySpent auctionWon profileImage')

  res.status(200).json({
    success: true,
    leaderboard,
  })
})
