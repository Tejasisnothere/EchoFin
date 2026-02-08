import cloudinary from "cloudinary";

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "LOADED" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING"
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_key_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary