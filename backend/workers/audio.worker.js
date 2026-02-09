import File from "../models/fileModel.js";
import { normalizeFromUrl } from "../services/audio.service.js";
import { uploadNormalizedDirect } from "../services/cloudinary.service.js";

export const processAudio = async (fileId, audioUrl) => {
  console.log(`[${fileId}] WORKER INVOKED`);
  console.log(`[${fileId}] audioUrl → ${audioUrl}`);

  const jobStart = Date.now();

  try {
    console.time(`[${fileId}] status-update(normalizing)`);
    await File.findByIdAndUpdate(fileId, { status: "normalizing" });
    console.timeEnd(`[${fileId}] status-update(normalizing)`);

    console.log(`[${fileId}] Calling normalizeFromUrl`);

    console.time(`[${fileId}] normalizeFromUrl`);
    const normalizedBuffer = await normalizeFromUrl(audioUrl);
    console.timeEnd(`[${fileId}] normalizeFromUrl`);

    if (!normalizedBuffer) {
      throw new Error("normalizeFromUrl returned empty buffer");
    }

    const sizeMB = (normalizedBuffer.length / (1024 * 1024)).toFixed(2);
    console.log(
      `[${fileId}] normalized buffer size → ${normalizedBuffer.length} bytes (${sizeMB} MB)`
    );

    console.time(`[${fileId}] uploadNormalizedDirect`);
    const uploaded = await uploadNormalizedDirect(normalizedBuffer);
    console.timeEnd(`[${fileId}] uploadNormalizedDirect`);

    console.log(
      `[${fileId}] Upload successful → ${uploaded.secure_url}`
    );

    console.time(`[${fileId}] status-update(normalized)`);
    await File.findByIdAndUpdate(fileId, {
      status: "normalized",
      normalized: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
      }
    });
    console.timeEnd(`[${fileId}] status-update(normalized)`);

    const totalTime = ((Date.now() - jobStart) / 1000).toFixed(2);
    console.log(`[${fileId}] WORKER COMPLETED in ${totalTime}s`);

  } catch (err) {
    console.error(`[${fileId}] WORKER FAILED`);
    console.error(`[${fileId}] Error →`, err);

    try {
      await File.findByIdAndUpdate(fileId, {
        status: "failed",
        error: err.message
      });
    } catch (dbErr) {
      console.error(`[${fileId}] Failed to update failure status`, dbErr);
    }
  }
};
