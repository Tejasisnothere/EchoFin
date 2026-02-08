import File from "../models/fileModel.js";
import { uploadFile } from "../services/cloudinary.service";
import { processAudio } from "../workers/audio.worker.js";

export const uploadAudio = async (req, res) => {
    const file = req.file;

    const uploaded = await uploadFile(
        file.path,
        "echofin/audio/original",
        "video"
    );

    const doc = await File.create({
        type: "audio",
        original: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
        }
    });

    // async, fire-and-forget
    processAudio(doc._id, uploaded.secure_url);

    res.json({
        file_id: doc._id,
        status: doc.status
    });
};