import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        await connectDB();
        const { projectId } = await params

        const project = await Project.findById(projectId);

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            project,
        });
    } catch (error) {
        return NextResponse.json(
            { message: `failed to register user ${error}` },
            { status: 500 }
        );
    }
}