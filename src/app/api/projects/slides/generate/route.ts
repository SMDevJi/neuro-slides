import { metadata } from "@/app/layout";
import { generateContentStream } from "@/lib/ai";
import authoptions from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/project.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



const SLIDER_PROMPT = `Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons) 
code for a 16:9 ppt slider in Modern Dark style.
{DESIGN_STYLE}. No responsive design; use a fixed 16:9 layout for slides.
Use Flowbite component structure. Use different layouts depending on content and style.
Use TailwindCSS colors like primary, accent, gradients, background, etc., and include colors from {COLORS_CODE}.
MetaData for Slider: {METADATA}

- Ensure images are optimized to fit within their container div and do not overflow.
- Use proper width/height constraints on images so they scale down if needed to remain inside the slide.
- Maintain 16:9 aspect ratio for all slides and all media.
- Use CSS classes like 'object-cover' or 'object-contain' for images to prevent stretching or overflow.
- Use grid or flex layouts to properly divide the slide so elements do not overlap.

Generate Image if needed using:
'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.  

<!-- Slide Content Wrapper (Fixed 16:9 Aspect Ratio) -->
<div class="w-full h-full relative overflow-hidden p-6">
  <!-- Slide content here -->
</div>
Also do not add any overlay : Avoid this :
    <div class="absolute inset-0 bg-linear-to-br from-primary to-secondary opacity-20"></div>


Just provide body content for 1 slider. Make sure all content, including images, stays within the main slide div and preserves the 16:9 ratio.
`







export async function POST(req: Request) {
    try {
        const { designData, metaData } = await req.json();

        const designStyle = designData?.designGuide
        const colorsCode = JSON.stringify(designData?.colors)


        //console.log(designStyle)
        //console.log(colorsCode)
        //console.log(metaData)
        if (!designStyle || !colorsCode || !metaData) {

            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const session = await getServerSession(authoptions);

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        //console.log(SLIDER_PROMPT.replace("{DESIGN_STYLE}", designStyle).replace("{COLORS_CODE}", colorsCode).replace("{METADATA}", JSON.stringify(metaData)))
        const aiStream = await generateContentStream(
            SLIDER_PROMPT
                .replace("{DESIGN_STYLE}", designStyle)
                .replace("{COLORS_CODE}", colorsCode)
                .replace("{METADATA}", JSON.stringify(metaData))
        );

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of aiStream) {
                        const text = chunk.text || "";
                        const finalText = text.replace('```html', '').replace('html', '').replace('```', '')
                        controller.enqueue(encoder.encode(finalText));
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
            },
        });

    } catch (error) {
        return new Response("Error generating slide", { status: 500 });
    }
}