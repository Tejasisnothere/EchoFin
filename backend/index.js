import express from "express";
import normaliseAudio from "./middlewares/normalise.js";
import multer from "multer";
import path from "path";

const PORT = process.env.PORT || 8000;

const app = express();

const upload = multer({
    dest: "/uploads/raw"
})

app.post("/test-audio", upload.single("audio"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = path.join(
      "uploads/normalized",
      `${Date.now()}_16khz.wav`
    );

    await normaliseAudio(inputPath, outputPath);

    res.json({
      message: "Audio normalized successfully",
      input: inputPath,
      output: outputPath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Audio normalization failed" });
  }
});

app.get("/", (req, res) => {
    res.send("hello pookie...get command lmao");
})

app.listen(PORT, () => {
    console.log("Hello from the server pookie");
})