import { connectDB } from "@/lib/db";
import { sendOtp } from "@/lib/otp";
import Otp from "@/models/otp.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const otpValidMins = 2;

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email } = await req.json();

        const now = new Date();

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email:normalizedEmail });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists. Please login instead." },
                { status: 409 }
            );
        }

        const existingOtp = await Otp.findOne({ email:normalizedEmail });

        if (existingOtp) {
            if (existingOtp.expiresAt > now) {
                return NextResponse.json(
                    { message: "OTP already sent. Please wait until it expires." },
                    { status: 400 }
                );
            }

            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

            existingOtp.otp = newOtp;
            existingOtp.expiresAt = new Date(Date.now() + otpValidMins * 60 * 1000);

            await existingOtp.save();

            await sendOtp(email, newOtp);

            return NextResponse.json({ success: true, message: "New OTP sent" ,otpValidMins});
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + otpValidMins * 60 * 1000),
        });

        await sendOtp(email, otp);

        return NextResponse.json({ success: true, otpValidMins });

    } catch (error) {
        return NextResponse.json(
            { message: `failed to send otp ${error}` },
            { status: 500 }
        );
    }
}