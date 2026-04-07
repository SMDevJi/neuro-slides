import { connectDB } from "@/lib/db";
import Otp from "@/models/otp.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { otpValidMins } from "../send-otp/route";
import { sendOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already registered. Please login." },
                { status: 409 }
            );
        }

        const existingOtp = await Otp.findOne({ email: normalizedEmail });

        if (existingOtp) {
            const diff = Date.now() - new Date(existingOtp.updatedAt).getTime();

            if (diff < 30 * 1000) {
                return NextResponse.json(
                    { error: "Please wait before requesting another OTP" },
                    { status: 429 }
                );
            }
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        const expiresAt = new Date(Date.now() + otpValidMins * 60 * 1000);

        if (existingOtp) {
            existingOtp.otp = newOtp;
            existingOtp.expiresAt = expiresAt;
            existingOtp.verified = false;

            await existingOtp.save();
        } else {
            await Otp.create({
                email: normalizedEmail,
                otp: newOtp,
                expiresAt,
                verified: false
            });
        }

        await sendOtp(normalizedEmail, newOtp);

        console.log("Resent OTP:", newOtp);

        return NextResponse.json({
            success: true,
            message: "OTP resent successfully",
            otpValidMins
        });

    } catch (error) {
        return NextResponse.json(
            { message: `failed to resend otp ${error}` },
            { status: 500 }
        );
    }
}