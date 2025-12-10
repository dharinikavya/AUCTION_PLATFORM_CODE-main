import app from "./app.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.v2.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
