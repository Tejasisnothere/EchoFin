import mongoose from "mongoose";
import { Worker } from "bullmq";
import { redis } from "../configs/redis.js";
import { processAudio } from "./audio.worker.js";

mongoose.set("bufferCommands", false);

async function startWorker() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Worker connected to MongoDB");

  new Worker(
    "audio-normalization",
    async (job) => {
      const { fileId, audioUrl } = job.data;

      console.log("Worker received job:", job.data);
      await processAudio(fileId, audioUrl);
    },
    {
      connection: redis,
      concurrency: 1,
      lockDuration: 10 * 60 * 1000
    }
  );
}

startWorker().catch((err) => {
  console.error("Worker startup failed:", err);
  process.exit(1);
});
