import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    type: {
        type: String,
        enum: ["audio", "document", "image"]
    },

    original: {
        url: String,
        public_id: String
    },

    normalized: {
        url: String,
        public_id: String
    },

    status: {
        type: String,
        enum: ["uploaded", "processing", "completed", "failed"],
        default: "uploaded"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("File", fileSchema);