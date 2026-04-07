import authoptions from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/project.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { projectId, slides } = await req.json()
        const session = await getServerSession(authoptions)

        const userId = session?.user?.id

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (!slides || !projectId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }


        // Fetch project first to check if slides already exist
        const userData = await User.findById(userId);
        const project = await Project.findById(projectId);

        if (!userData) {
            return NextResponse.json({ error: "User not found" },
                { status: 404 });
        }

        if (!project) {
            return NextResponse.json({ error: "Project not found" },
                { status: 404 }
            );
        }


        let creditBalance = userData.credits;

        //First-time save check
        const isFirstSave = !project.slides || project.slides.length === 0;

        if (isFirstSave && userData.credits !== "unlimited") {

            //Block if no credits
            if (typeof userData.credits === "number" && userData.credits <= 0) {
                return NextResponse.json(
                    { error: "No credits left" },
                    { status: 403 }
                );
            }

            //Deduct credits
            if (typeof userData.credits === "number") {
                userData.credits -= 1;
                await userData.save();
                creditBalance = userData.credits;
            }
        }

        // Update project slides
        project.slides = slides;
        await project.save();



        return NextResponse.json(
            { project, updatedCredits: creditBalance },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `failed to save slides ${error}` },
            { status: 500 }
        );
    }
}