'use client';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { CiFolderOn } from "react-icons/ci";
import { FaArrowUp } from "react-icons/fa6";
import { DesignStyle, IProject, Outline } from "@/models/project.model";
import { useSession } from 'next-auth/react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';



const AllProjects = () => {
    const [projects, setProjects] = useState<IProject[]>([])
    const { data: session, update } = useSession()
    const user = session?.user

    useEffect(() => {
        user && getProjects();
    }, [user])


    const getProjects = async () => {
        try {
            //setLoading(true);
            //setError(null);

            const res = await axios.get('/api/projects');

            const projects = res.data.projects
            setProjects(projects);
            console.log(projects)



        } catch (err: any) {
            //setError(err.response?.data?.message || err.message);
            console.log(err.response?.data?.message || err.message);
        } finally {
            //setLoading(false);
        }

    }



    const formatDate = (timestamp: any) => {
        const formatted = moment(timestamp).fromNow();
        return formatted
    }



    return (
        <>
            <div className='max-w-7xl mx-auto px-5  my-10'>
                <h1 className='font-semibold text-2xl'>My Projects</h1>

            </div>
            <div className="projects p-6 max-w-7xl mx-auto">
                {!projects?.length ?

                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CiFolderOn />
                            </EmptyMedia>
                            <EmptyTitle>No Projects Yet</EmptyTitle>
                            <EmptyDescription>
                                You haven&apos;t created any projects yet. Get started by creating
                                your first project.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="flex-row justify-center gap-2">
                            <Button className='rounded-sm cursor-pointer'>Create Project</Button>
                        </EmptyContent>

                    </Empty>
                    :
                    <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4'>
                        {projects.map((project, index) => (
                            <Link key={project?._id.toString()} href={`/workspace/projects/${project?._id.toString()}/editor`}>
                                <div  className='p-4 border rounded-2xl shadow mt-3 space-y-2'>
                                    <img src="/ppt.png" alt="PPT Logo" width={50} height={50} />
                                    <h2 className='font-bold text-lg'>{project?.userInputPrompt}</h2>
                                    <h2 className='text-gray-500 '>Total {project.slides?.length} Slides</h2>
                                    <p className='text-red-600'>{formatDate(project?.createdAt)}</p>
                                </div>
                            </Link>

                        ))}
                    </div>
                }
            </div>
        </>

    )
}

export default AllProjects