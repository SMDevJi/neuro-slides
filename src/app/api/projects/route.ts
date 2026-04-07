import authoptions from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/project.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { userInputPrompt, noOfSlides } = await req.json()
        const session = await getServerSession(authoptions)

        const userId = session?.user?.id

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (!userInputPrompt || !userId || !noOfSlides) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const project = await Project.create({
            userInputPrompt, userId, noOfSlides
        })

        return NextResponse.json(
            project,
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `failed to register user ${error}` },
            { status: 500 }
        );
    }
}









export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authoptions)

        const userId = session?.user?.id

        const projects = await Project.find({ userId });;

        if (!projects) {
            return NextResponse.json(
                { message: "No Project found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            projects,
        });
    } catch (error) {
        return NextResponse.json(
            { message: `failed to register user ${error}` },
            { status: 500 }
        );
    }
}