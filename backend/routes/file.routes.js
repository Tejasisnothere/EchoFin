import express from "express";
import { getFileById, getFileStatus } from "../controllers/file.controller.js";
// import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/:id",
  // authMiddleware,
  getFileById
);

export default router;