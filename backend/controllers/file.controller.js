import File from "../models/fileModel.js";

export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (err) {
    res.status(500).json({ message: "Error fetching file" });
  }
};

export const getFileStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    res.json({
      file_id: file._id,
      status: file.status,
      original: file.original,
      normalized: file.normalized || null,
      createdAt: file.createdAt
    });
  } catch (err) {
    console.error("STATUS POLL ERROR:", err);
    res.status(500).json({ message: "Failed to fetch file status" });
  }
};