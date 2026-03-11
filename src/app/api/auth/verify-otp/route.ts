import { connectDB } from "@/lib/db";
import Otp from "@/models/otp.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email, otp } = await req.json();
        const normalizedEmail = email.toLowerCase().trim();
        const record = await Otp.findOne({
            email: normalizedEmail,
            otp
        });

        if (!record) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        if (record.expiresAt < new Date()) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }

        record.verified = true;
        await record.save();

        return NextResponse.json({ verified: true });

    } catch (error) {
        return NextResponse.json(
            { message: `failed to validate otp ${error}` },
            { status: 500 }
        );
    }

}