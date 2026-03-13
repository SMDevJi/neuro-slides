import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import  authOptions  from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    let orders;

    try {
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Orders not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully.",
      orders
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}