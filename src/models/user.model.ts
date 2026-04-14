import mongoose, { Schema, model } from "mongoose";

export interface IUser {
    _id:mongoose.Types.ObjectId;
    name?: string;
    email: string;
    image?: string;
    password?: string;
    credits: number | "unlimited";
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String
        },
        password: {
            type: String
        },
        credits: {
            type: Schema.Types.Mixed,
            default: 2
        }
    },
    { timestamps: true }
);

const userModel = mongoose.models?.User || model<IUser>("User", userSchema);

export default userModel;