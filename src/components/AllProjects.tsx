import React from 'react'
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

const AllProjects = () => {
    return (
        <>
            <div className='w-full px-5 flex justify-between my-10'>
                <h1 className='font-semibold text-2xl'>My Projects</h1>
                <button className='bg-primary text-white rounded-sm px-2 py-1 cursor-pointer'> + Create New</button>



            </div>
            <div className="projects">
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
            </div>
        </>

    )
}

export default AllProjects