'use client';
import OutlineArea from '@/components/OutlineArea';
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react';
import { DesignStyle, IProject, Outline, Slide } from "@/models/project.model";
import axios from 'axios';
import SlideFrame from '@/components/SlideFrame';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MdOutlineFileDownload } from "react-icons/md";
import { LuLoaderCircle } from 'react-icons/lu';
import * as htmlToImage from "html-to-image";
import PptxGenJS from "pptxgenjs";
import { useSession } from 'next-auth/react';

const page = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const [project, setProject] = useState<IProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const [slides, setSlides] = useState<Slide[]>()
    const [isSlidesGenerated, setIsSlidesGenerated] = useState<any>();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const { data: session, update } = useSession()
    const [exportAllowed, setexportAllowed] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!projectId) return;
        fetchProject();
    }, [projectId]);


    const fetchProject = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get(`/api/projects/${projectId}`);

            const projectData = res.data.project
            setProject(projectData);
            console.log(projectData)
            if (!projectData?.outline || projectData?.outline.length == 0) {
                toast.error('Generate outline first!')
                router.push(`/workspace/projects/${projectData?._id}/outline`)
            }

        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            console.log(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!project) return;
        if (!project.slides || project.slides.length === 0) {
            generateSlides();
        } else {
            setSlides(project?.slides)
            setIsSlidesGenerated(true)
        }
    }, [project])








    const generateSlides = async () => {
        if (!project?.outline || project.outline.length === 0) return;

        console.log("🚀 Starting slide generation...");


        for (let index = 0; index < project.outline.length; index++) {
            const metaData = project.outline[index];
            const designData = project?.designStyle;


            console.log("🧠 Generating slide", index + 1);
            await GeminiSlideCall(metaData, designData!, index); // wait for one slide to finish before next
            console.log("Finished slide", index + 1);
        }

        console.log("All slides generated!");

        setIsSlidesGenerated(Date.now());

    };



    const GeminiSlideCall = async (metaData: Outline, designData: DesignStyle, index: number) => {
        try {



            console.log(project?.outline)
            const res = await fetch("/api/projects/slides/generate", {
                method: "POST",
                body: JSON.stringify({
                    designData,
                    metaData
                }),
            });

            if (!res.body) {
                throw new Error("No response body");
            }
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            let result = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                result += chunk;
                //console.log(result)

                setSlides((prev: any[]) => {
                    const updated = prev ? [...prev] : [];
                    updated[index] = { code: result };
                    return updated;
                });
            }
            console.log("Slide", index + 1, "complete");






        }
        catch (err) {
            console.error("Error generating slide", index + 1, err);
        }
    };




    const updateSliderCode = (updatedSliderCode: string, index: number) => {
        setSlides((prev: any) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                code: updatedSliderCode
            }
            return updated
        })
        setIsSlidesGenerated(Date.now())
    }




    useEffect(() => {
        if (isSlidesGenerated) {
            SaveAllSlides();
        }
    }, [isSlidesGenerated])

    const SaveAllSlides = async () => {
        if (!isSlidesGenerated) return
        try {
            const resp = await axios.post('/api/projects/slides/save', {
                projectId, slides
            })
            console.log(resp.data)
            console.log(resp.data?.updatedCredits)
            if (resp.data?.updatedCredits !== undefined) {
                update({
                    credits: resp.data?.updatedCredits
                });
            }

            toast.success('Slides saved successfully!')
        } catch (err: any) {
            console.log(err.response?.data?.message || err.message)
            toast.error('Failed to save slides!')
            setexportAllowed(false)
        }
    }

    function createFilename(prompt: string | undefined) {
        const temp = prompt?.length as number > 20 ? prompt?.slice(0, 20) + "..." : prompt;
        return temp ?
            (temp
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join("") + '.pptx')
            :
            'MyPresentation.pptx';
    }


    const exportAllIframesToPPT = async () => {
        if (!exportAllowed) {
            toast.error('Failed to export PPT!')
            return
        }
        console.log(downloadLoading, isSlidesGenerated)
        if (!containerRef.current || downloadLoading || !isSlidesGenerated) return;
        setDownloadLoading(true);
        const pptx = new PptxGenJS();
        const iframes = containerRef.current.querySelectorAll("iframe");

        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i] as HTMLIFrameElement;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) continue;

            // Grab the main slide element inside the iframe (usually <body> or inner div)
            const slideNode =
                iframeDoc.querySelector("body > div") || iframeDoc.body;
            if (!slideNode) continue;

            console.log(`Exporting slide ${i + 1}...`);
            //@ts-ignore
            const dataUrl = await htmlToImage.toPng(slideNode, { quality: 1 });

            const slide = pptx.addSlide();
            slide.addImage({
                data: dataUrl,
                x: 0,
                y: 0,
                w: 10,
                h: 5.625,
            });
        }
        setDownloadLoading(false);
        const fileName = createFilename(project?.userInputPrompt);
        pptx.writeFile({ fileName  });
    };













    if (error) {
        return <div className="w-full min-h-[75vh] flex justify-center items-center">
            <h1 className="text-2xl ">Failed to load project details...</h1>

        </div>
    }

    return (
        <div className='w-full min-h-[75vh] p-10 flex justify-center'>
            <div className="area grid grid-cols-1 lg:grid-cols-5 mt-15 max-w-8xl w-full mx-auto gap-3">
                <div className="outlines col-span-1 lg:col-span-2 w-full ">
                    <h1 className='font-bold text-xl mt-7'>Sliders Outline</h1>
                    <OutlineArea outlineGenerating={loading}
                        handleUpdateOutline={() => console.log()}
                        outline={project?.outline ?? []}
                        className=''
                        showEdit={false}
                    />
                </div>
                <div className="slides col-span-1 lg:col-span-3 p-3 w-full  overflow-x-scroll  border-2 " ref={containerRef}>
                    {slides?.map((slide: any, index: number) => (
                        <SlideFrame slide={slide} key={index}
                            colors={project?.designStyle?.colors}
                            setUpdatedSlider={(updatedSliderCode: string) => updateSliderCode(updatedSliderCode, index)}
                        />
                    ))}

                </div>
            </div>
            <button className='fixed bottom-6
            transform left-1/2 -translate-x-1/2 text-lg 
            px-5 py-3 cursor-pointer bg-primary flex justify-center items-center text-white rounded-md gap-2 hover:bg-green-500
            '
                disabled={downloadLoading}
                onClick={exportAllIframesToPPT}
            >

                {downloadLoading ? (
                    <LuLoaderCircle className="animate-spin" />
                ) : (
                    <MdOutlineFileDownload size={25} />
                )}
                {downloadLoading ? "Exporting..." : "Export PPT"}
            </button>
        </div>
    )
}

export default page