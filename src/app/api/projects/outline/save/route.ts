import authoptions from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/project.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { projectId, outline, designStyle } = await req.json()
        const session = await getServerSession(authoptions)

        //const userId = session?.user?.id

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (!outline || !designStyle || !projectId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const project = await Project.findByIdAndUpdate(
            projectId,
            { outline, designStyle },
            { new: true }
        )

        return NextResponse.json(
            project,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `failed to update project ${error}` },
            { status: 500 }
        );
    }
}