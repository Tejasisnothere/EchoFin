import cloudinary from "../configs/cloudinary.js";

export const uploadBuffer = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "video"
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log("☁️ Cloudinary upload success:", result.public_id);
          resolve(result);
        }
      }
    ).end(buffer); 
  });
};
