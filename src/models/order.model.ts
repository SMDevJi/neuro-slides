import mongoose, { Schema, model, Document } from "mongoose";

export interface IOrder {
    _id: mongoose.Types.ObjectId;
    productName: string;
    userId: mongoose.Types.ObjectId;
    checkoutId?: string;
    price: number;
    coins: number | 'unlimited';
    createdAt?: Date;
    updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        productName: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        checkoutId: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        coins: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    { timestamps: true }
);

const orderModel = mongoose.models?.Order || model<IOrder>("Order", orderSchema);

export default orderModel;