import { otpValidMins } from "@/app/api/auth/send-otp/route";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function sendOtp(email: string, otp: string) {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: `Neuro Slides OTP Verification [${otp}]`,
        html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px;">
        <h2>Your OTP Code</h2>
        <p>Your One-Time Password is:</p>
        <p style="font-size: 32px; font-weight: bold; text-align:center">${otp}</p>
        <p>This code is valid for ${otpValidMins} minutes.</p>
      </div>
    </div>`
    });
}