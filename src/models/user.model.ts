import mongoose from "mongoose";

interface IUser {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    image?: string;
    password?: string;
    credits:number;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
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
    credits:{
        type:Number,
        default:2
    }
}, { timestamps: true })

const User = mongoose.models?.user || mongoose.model('User', userSchema)
export default User;