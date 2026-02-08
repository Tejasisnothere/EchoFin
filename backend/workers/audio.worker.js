import File from "../models/fileModel.js";
import { normalizeFromUrl } from "../services/audio.service.js";
import { uploadNormalizedDirect } from "../services/cloudinary.service.js";
import axios from "axios";

export const processAudio = async (fileId, audioUrl) => {
  console.log("Worker invoked");

  try {
    console.log("Updating status → normalizing");
    await File.findByIdAndUpdate(fileId, { status: "normalizing" });

    console.log("Calling normalizeFromUrl");
    const normalizedBuffer = await normalizeFromUrl(audioUrl);

    console.log(
      "normalizeFromUrl returned buffer of size:",
      normalizedBuffer?.length
    );

    console.log("Uploading normalized audio");
    const uploaded = await uploadNormalizedDirect(normalizedBuffer);

    console.log("Upload successful:", uploaded.secure_url);

    await File.findByIdAndUpdate(fileId, {
      status: "normalized",
      normalized: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
      }
    });

    console.log(" Worker completed");

  } catch (err) {
    console.error("WORKER CRASHED:", err);

    await File.findByIdAndUpdate(fileId, {
      status: "failed",
      error: err.message
    });
  }
};
