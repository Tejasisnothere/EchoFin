import File from "../models/fileModel.js";
import { normalizeFromUrl } from "../services/audio.service.js";
import { uploadBuffer } from "../services/cloudinary.service.js";

export const processAudio = async (fileId, audioUrl) => {
  try {
    console.log("▶ Processing audio:", fileId);

    await File.findByIdAndUpdate(fileId, {
      status: "processing"
    });

    const normalizedBuffer = await normalizeFromUrl(audioUrl);

    const uploaded = await uploadBuffer(
      normalizedBuffer,
      "echofin/audio/normalized"
    );

    await File.findByIdAndUpdate(fileId, {
      status: "completed",
      normalized: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
      }
    });

    console.log("✅ Audio processing completed:", fileId);
  } catch (err) {
    console.error("Audio processing failed:", err);
    await File.findByIdAndUpdate(fileId, {
      status: "failed"
    });
  }
};
