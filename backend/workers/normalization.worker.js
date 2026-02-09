import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { processAudio } from "./audio.worker.js";

new Worker(
  "audio-normalization",
  async (job) => {
    const { fileId, audioUrl } = job.data;
    console.log("Worker received job:", job.data);
    await processAudio(fileId, audioUrl);
  },
  {
    connection: redis,
    concurrency: 1
  }
);