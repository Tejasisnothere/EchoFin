import cloudinary from "../configs/cloudinary.js";

export const uploadBuffer = async (buffer, folder, resourceType) => {
    return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    ).end(buffer);
  });
};

export const uploadAudioFile = () => {

};

export const uploadFile = async (filePath, folder, resourceType) => {
    return cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: resourceType
    })
};