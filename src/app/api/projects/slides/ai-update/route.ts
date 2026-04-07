import generateContent from "@/lib/ai";
import authoptions from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/project.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


const UPDATE_PROMPT = `
      Regenerate or rewrite the following HTML code based on this user instruction, use proper tailwindcss classes.
      If user asked to change the image/regenerate the image then make sure to use
      ImageKit:
    'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
    Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.
    if user want to crop image, or remove background or scale image or optimze image then add image kit ai transfromation 
    by providing ?tr=fo-auto,<other transfromation> etc.  
      "User Instruction is :{userAiPrompt}"
      HTML code:
      {oldHTML}
      `;

export async function POST(req: NextRequest) {
    try {
        const { userAiPrompt, oldHTML } = await req.json()
        const session = await getServerSession(authoptions)

        const userId = session?.user?.id

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        //console.log(oldHTML)

        if (!userAiPrompt || !oldHTML) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newHTML = await generateContent(UPDATE_PROMPT.replace('{userAiPrompt}', userAiPrompt).replace('{oldHTML}', oldHTML))
        //console.log(newHTML)

        return NextResponse.json(
            { newHTML },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `failed to generate updated slide content ${error}` },
            { status: 500 }
        );
    }
}