'use client';
import OutlineArea from '@/components/OutlineArea';
import { useParams } from 'next/navigation'
import { useEffect,useState } from 'react';
import { IProject} from "@/models/project.model";
import axios from 'axios';



const page = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const [project, setProject] = useState<IProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null)

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


        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            console.log(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-[75vh] p-10 flex justify-center'>
            <div className="area grid grid-cols-5 mt-15 max-w-7xl w-full mx-auto">
                <div className="outlines col-span-2 w-full h-screen overflow-auto">
                    <OutlineArea outlineGenerating={loading} 
                    handleUpdateOutline={()=>console.log()} 
                    outline={project?.outline??[]}
                    />
                </div>
                <div className="slides col-span-3">
                    Slides
                </div>
            </div>

        </div>
    )
}

export default page