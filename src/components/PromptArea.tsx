'use client';
import React, { useState } from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupTextarea,
} from "@/components/ui/input-group"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IoMdArrowUp } from "react-icons/io";
import { VscLoading } from "react-icons/vsc";
import { toast } from 'sonner';
import Project from '@/models/project.model';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const page = () => {
    const [userInput, setUserInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [noOfSlides, setnoOfSlides] = useState('4 to 6')

    const { data: session } = useSession()
    const user = session?.user
    //console.log(user)

    const router = useRouter()

    const createAndSaveProject = async () => {
        if (!userInput) return
        try {
            setLoading(true)
            const resp = await axios.post('/api/projects', {
                userInputPrompt: userInput,noOfSlides
            })
            console.log(resp.data)
            toast.success('Project created successfully!')
            router.push(`/workspace/projects/${resp.data._id}/outline`)
        } catch (err: any) {
            console.log(err.response?.data?.message || err.message)
            toast.error('Failed to create project!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='h-full p-3'>
            <h1 className='mt-35 text-3xl font-semibold text-center'>Tell us about your topic, and we’ll create the slides for you.</h1>
            <p className='mt-2 text-center text-xl text-gray-600'>Your design will be added as a new project.</p>

            <div className="ip flex justify-center mt-5">
                <InputGroup className="max-w-lg ">
                    <InputGroupTextarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder='Tell us what your presentation will cover' className='min-h-30 '
                    />

                    <InputGroupAddon align={'block-end'}>
                        <Select
                        value={noOfSlides}
                        onValueChange={setnoOfSlides}
                        >
                            <SelectTrigger className="w-full max-w-40">
                                <SelectValue placeholder="Select No. Of Sliders" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>No. Of Sliders</SelectLabel>
                                    <SelectItem value="4 to 6">4-6 Sliders</SelectItem>
                                    <SelectItem value="6 to 8">6-8 Sliders</SelectItem>
                                    <SelectItem value="8 to 12">8 to 12 Sliders</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputGroupButton
                            variant={'default'}
                            size={'icon-sm'}
                            onClick={createAndSaveProject}
                            className={`rounded-full ml-auto cursor-pointer ${!userInput ? "opacity-50 pointer-events-none" : ""}`}
                        >
                            {loading ? <VscLoading className='animate-spin' /> : <IoMdArrowUp />}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>

        </div>
    )
}

export default page