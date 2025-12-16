import app from "./app.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { endedAuctionCron } from "./automation/endedAuctionCron.js"; // ✅ IMPORT

dotenv.config();

cloudinary.v2.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

/* 🔥 START CRON */
endedAuctionCron(); // ✅ THIS LINE IS WHY NOTHING WORKED

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
