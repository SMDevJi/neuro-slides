import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    verified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models?.Otp || mongoose.model("Otp", otpSchema);