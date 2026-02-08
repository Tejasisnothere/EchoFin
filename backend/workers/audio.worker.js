import File from "../models/fileModel.js";
import { normalizeFromUrl } from "../services/audio.service.js";
import { uploadBuffer } from "../services/cloudinary.service.js";

export const processAudio = async (fileId, audioUrl) => {
    try {
    await File.findByIdAndUpdate(fileId, {
      status: "processing"
    });

    const normalizedBuffer = await normalizeFromUrl(audioUrl);

    const uploaded = await uploadBuffer(
      normalizedBuffer,
      "echofin/audio/normalized",
      "video"
    );

    await File.findByIdAndUpdate(fileId, {
      status: "completed",
      normalized: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
      }
    });
  } catch (err) {
    console.error(err);
    await File.findByIdAndUpdate(fileId, {
      status: "failed"
    });
  }
};