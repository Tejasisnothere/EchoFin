import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import axios from "axios";
import fs from "fs";
import os from "os";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath);

export const normalizeFromUrl = async (audioUrl) => {
  console.log("⬇Downloading original audio...");

  const response = await axios.get(audioUrl, {
    responseType: "arraybuffer",
    timeout: 300000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

  const inputPath = path.join(os.tmpdir(), `input-${Date.now()}.mp3`);
  const outputPath = path.join(os.tmpdir(), `output-${Date.now()}.wav`);

  fs.writeFileSync(inputPath, Buffer.from(response.data));

  console.log("Running FFmpeg...");

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .audioCodec("pcm_s16le")
      .format("wav")
      .on("end", resolve)
      .on("error", reject)
      .save(outputPath);
  });

  const normalizedBuffer = fs.readFileSync(outputPath);

  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);

  return normalizedBuffer;
};