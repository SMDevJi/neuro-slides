'use client';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { DesignStyle, IProject, Outline } from "@/models/project.model";
import axios from "axios";
import SliderStyles from "@/components/SliderStyles";
import OutlineArea from "@/components/OutlineArea";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "sonner";
import { VscLoading } from "react-icons/vsc";
import { useSession } from "next-auth/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link";


const page = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()
    const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null)

    const [project, setProject] = useState<IProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false)
    const [outlineGenerating, setOutlineGenerating] = useState(false)
    const [outline, setOutline] = useState<Outline[] | []>([])
    const [error, setError] = useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState(false)
    const { data: session, update } = useSession()
    const user = session?.user


    useEffect(() => {
        projectId && fetchProject()
    }, [projectId])


    const fetchProject = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get(`/api/projects/${projectId}`);

            const projectData = res.data.project
            setProject(projectData);
            console.log(projectData)

            if (projectData.outline.length == 0) {
                generateSlidersOutline(projectData)
            }

        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            console.log(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };


    const generateSlidersOutline = async (projectData: IProject) => {
        try {
            setOutlineGenerating(true);
            setError(null);

            const res = await axios.post('/api/projects/outline/generate', {
                userInputPrompt: projectData.userInputPrompt, noOfSlides: projectData.noOfSlides
            });

            setOutline(res.data.outline);
            console.log(res.data.outline)
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            console.log(err.response?.data?.message || err.message);
        } finally {
            setOutlineGenerating(false);
        }
    }


    const handleUpdateOutline = (index: string, value: Outline) => {
        setOutline((prev) =>
            prev.map((item) =>
                item.slideNo === index ? { ...item, ...value } : item
            ))
    }



    const saveOutlineAndStyle = async () => {
        if (!selectedStyle) {
            toast.error('Please select style!')
            return
        }
        if ((typeof user?.credits == 'number' && user?.credits <= 0) || (typeof user?.credits == 'string' && user?.credits != 'unlimited')) {
            setAlertOpen(true)
            return
        }

        try {
            setUpdating(true)
            const resp = await axios.post('/api/projects/outline/save', {
                projectId, outline, designStyle: selectedStyle
            })
            console.log(resp.data)
            toast.success('Outline saved successfully!')
            router.push(`/workspace/projects/${resp.data._id}/editor`)
        } catch (err: any) {
            console.log(err.response?.data?.message || err.message)
            toast.error('Failed to update outline!')
        } finally {
            setUpdating(false)
        }
    }



    if (loading) {
        return <div className="w-full min-h-[75vh] flex justify-center items-center">
            <h1 className="text-2xl ">Loading project details...</h1>

        </div>
    }

    if (error) {
        return <div className="w-full min-h-[75vh] flex justify-center items-center">
            <h1 className="text-2xl ">Failed to load project details...</h1>

        </div>
    }
    return (
        <div className='mt-35 min-h-[75vh] flex flex-col items-center p-3'>
            <div className="max-w-3xl">
                <h1 className=" text-2xl font-bold">Select Settings and Slider Outline</h1>
                <SliderStyles selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} />
                <h1 className='font-bold text-xl mt-7'>Sliders Outline</h1>
                <OutlineArea outlineGenerating={outlineGenerating} outline={outline}
                    handleUpdateOutline={(index: string, value: Outline) => handleUpdateOutline(index, value)}
                    showEdit={true}
                />
            </div>


            <Button
                onClick={saveOutlineAndStyle}
                disabled={outlineGenerating || updating}
                className='fixed bottom-6 transform left-1/2 -translate-x-1/2 py-6 px-5 text-lg cursor-pointer disabled:opacity-100 disabled:bg-green-300 disabled:cursor-not-allowed'>
                {updating ? 'Generating Slides..' : 'Generate Slides'} {updating ? <VscLoading className="animate-spin" /> : <FaArrowRight />}
            </Button>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger asChild>

                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Not enough credits!</AlertDialogTitle>
                        <AlertDialogDescription>
                            You don't have enough credits left! Please purchase.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <Link href='/pricing'>
                            <Button className="cursor-pointer">Buy Credits</Button>
                        </Link>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default page