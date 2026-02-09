import { Queue } from "bullmq";
import { redis } from "../redis/connection.js";

export const normalizationQueue = new Queue("audio-normalization", {
  connection: redis
});