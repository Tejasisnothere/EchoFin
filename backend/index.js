import "./configs/env.js";

import express from "express";
import connectDB from "./configs/db.js";
import fileRoutes from "./routes/file.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import normaliseAudio from "./middlewares/normalise.js";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use("/file", fileRoutes);
app.use("/upload", uploadRoutes);

connectDB();

app.get("/", (req, res) => {
    res.send("hello pookie...get command lmao");
})

app.post("/test-audio", normaliseAudio);

app.listen(PORT, () => {
    console.log("Hello from the server pookie", PORT);
})