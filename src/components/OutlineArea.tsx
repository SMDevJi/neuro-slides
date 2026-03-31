import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Outline } from '@/models/project.model'
import { Button } from './ui/button'
import { MdEditNote } from "react-icons/md";
import EditOutlineDialog from './EditOutlineDialog';

type pageProps = {
    outlineGenerating: boolean
    outline: Outline[]
    handleUpdateOutline:any
}

const OutlineArea = ({ outlineGenerating, outline,handleUpdateOutline }: pageProps) => {

    console.log(outlineGenerating)

    return (
        <div className='my-7'>
            <h1 className='font-bold text-xl'>Sliders Outline</h1>
            {outlineGenerating &&

                <div className=' mt-1'>
                    {[1, 2, 3, 4].map((item, idx) =>
                        <Skeleton
                            key={idx}
                            className="h-20  w-full rounded-xl  mb-7" />
                    )}
                </div>
            }

            <div className='mb-24'>
                {outline?.map((item, idx) =>
                    <div key={idx}
                        className='bg-white p-5 rounded-xl flex gap-6 items-center border-2 mt-5'
                    >
                        <h1 className='font-bold text-2xl  p-5 bg-green-200 rounded-xl'>{idx + 1}</h1>
                        <div>
                            <h2 className='font-bold'>{item.slidePoint}</h2>
                            <p>{item.outline}</p>
                        </div>

                        <EditOutlineDialog outlineData={item} onUpdate={handleUpdateOutline}>
                            <button className='p-2 bg-gray-200 rounded-md cursor-pointer'>
                                <MdEditNote size={30} />
                            </button>
                        </EditOutlineDialog>

                    </div>
                )}
            </div>

            
        </div>
    )
}

export default OutlineArea