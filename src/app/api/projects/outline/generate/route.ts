import generateContent from "@/lib/ai";
import authoptions from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/project.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


const OUTLINE_PROMPT = `
Generate a PowerPoint slide outline for the topic {userInput}. Create {noOfSlides} slides in total. Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.
Include the following structure:
The first slide should be a Welcome screen.
The second slide should be an Agenda screen.
The final slide should be a Thank You screen.
Return the response only in JSON format, following this schema:
[
 {
 "slideNo": "",
 "slidePoint": "",
 "outline": ""
 }
]
`

export async function POST(req: NextRequest) {
    try {
        const { userInputPrompt, noOfSlides } = await req.json()
        const session = await getServerSession(authoptions)

        const userId = session?.user?.id

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (!userInputPrompt || !noOfSlides) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const outline = await generateContent(OUTLINE_PROMPT.replace('{userInput}', userInputPrompt).replace('{noOfSlides}', noOfSlides))
        //console.log(result)

        return NextResponse.json(
            { outline: JSON.parse(outline as string) },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `failed to register user ${error}` },
            { status: 500 }
        );
    }
}