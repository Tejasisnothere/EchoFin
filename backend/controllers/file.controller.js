import File from "../models/fileModel.js";
import { processAudio } from "../workers/audio.worker.js";

export const registerFile = async (req, res) => {
  try {
    const { secure_url, public_id } = req.body;

    if (!secure_url || !public_id) {
      return res.status(400).json({ message: "Missing file data" });
    }

    // 1️⃣ Create DB record
    const file = await File.create({
      type: "audio",
      status: "uploaded",
      original: {
        url: secure_url,
        public_id
      }
    });

    // 2️⃣ Respond immediately (IMPORTANT)
    res.status(201).json({
      file_id: file._id,
      status: file.status
    });

    // 3️⃣ Auto-trigger normalization AFTER response
    setImmediate(() => {
      processAudio(file._id, secure_url);
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Register failed" });
  }
};

export const normalizeFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.status !== "uploaded") {
      return res.status(400).json({
        message: "File already processed or processing"
      });
    }

    // Fire async worker
    processAudio(file._id, file.original.url);

    res.json({
      message: "Normalization started",
      status: "normalizing"
    });
  } catch (err) {
    console.error("NORMALIZE ERROR:", err);
    res.status(500).json({ message: "Failed to start normalization" });
  }
};

export const getFileStatus = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({
      file_id: file._id,
      status: file.status,
      normalized: file.normalized || null,
      error: file.error || null
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch status" });
  }
};
