import cloudinary from "../configs/cloudinary.js";
import FormData from "form-data";
import axios from "axios";

export const uploadBuffer = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "video"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log("Cloudinary upload success:", result.public_id);
          resolve(result);
        }
      }
    ).end(buffer); 
  });
};

export const uploadRawAudio = async (buffer, filename) => {
  const base64 = buffer.toString("base64");

  return cloudinary.uploader.upload(
    `data:audio/mpeg;base64,${base64}`,
    {
      folder: "echofin/audio/original",
      resource_type: "raw",
      public_id: filename,
      overwrite: true
    }
  );
};

export const uploadNormalizedAudio = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "echofin/audio/normalized",
        resource_type: "video",   // audio must be uploaded as video
        format: "wav"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          reject(error);
        } else {
          console.log("Normalized audio uploaded:", result.secure_url);
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

export const uploadNormalizedDirect = async (buffer) => {
  const form = new FormData();

  form.append("file", buffer, {
    filename: "normalized.wav",
    contentType: "audio/wav"
  });

  form.append("upload_preset", "audio_normalized_unsigned");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dtzavevsb/video/upload",
    form,
    {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 300000                                                                                                                 
    }
  );

  return res.data;
};