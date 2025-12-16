import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileupload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'

import { errorMiddleware } from './midellware/error.js'
import userRoute from './routes/userRoute.js'
import auctionRoute from './routes/auctionRoute.js'
import bidRoute from './routes/bidRoute.js'
import commissionRoute from './routes/commissionRoute.js'
import supperAdminRoute from './routes/superAdminRoute.js'
import { endedAuctionCron } from './automation/endedAuctionCron.js'
import { verifyCommissionCron } from './automation/verifyCommissionCron.js'

dotenv.config()
const app = express()

/* ================= PATH SETUP ================= */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* ================= MIDDLEWARE ================= */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

/* ================= CORS ================= */
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://auction-frontend-vl5n.onrender.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.options('*', cors())

/* ================= FILE UPLOAD ================= */
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
)

/* ================= API ROUTES ================= */
app.use('/api/v1/user', userRoute)
app.use('/api/v1/auctionitem', auctionRoute)
app.use('/api/v1/bid', bidRoute)
app.use('/api/v1/commission', commissionRoute)
app.use('/api/v1/superadmin', supperAdminRoute)

/* ================= CRON JOBS ================= */
endedAuctionCron()
verifyCommissionCron()

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGOURL)
  .then(() => console.log('✅ DB connected'))
  .catch((err) => console.log(err))

/* ================= FRONTEND SERVE (SPA FIX) ================= */
app.use(
  express.static(
    path.join(__dirname, '../Frontend/dist')
  )
)

/* 🔥 SPA FALLBACK — THIS FIXES REFRESH ISSUE */
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../Frontend/dist/index.html')
  )
})

/* ================= ERROR HANDLER ================= */
app.use(errorMiddleware)

export default app
