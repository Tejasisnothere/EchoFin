import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {

    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true
    }
});

export default mongoose.model("User", userSchema);