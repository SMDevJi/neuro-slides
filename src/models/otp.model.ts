import mongoose, { Schema, model, Document } from "mongoose";

export interface IOtp {
    _id: mongoose.Types.ObjectId;
    email: string;
    otp: string;
    expiresAt: Date;
    verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const otpSchema = new Schema<IOtp>(
    {
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
        verified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const otpModel = mongoose.models?.Otp || model<IOtp>("Otp", otpSchema);

export default otpModel;