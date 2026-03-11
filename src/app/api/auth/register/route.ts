import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import Otp from "@/models/otp.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, name, password } = await req.json();

        if (!email || !name || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const otpRecord = await Otp.findOne({ email: normalizedEmail, verified: true });
        if (!otpRecord) {
            return NextResponse.json({ error: "OTP not verified" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 409 });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email: normalizedEmail,
            name,
            password: hashedPassword
        });

        await Otp.deleteOne({ _id: otpRecord._id });

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return NextResponse.json(
            { message: `failed to register user ${error}` },
            { status: 500 }
        );
    }

}