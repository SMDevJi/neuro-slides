import { IoSparklesOutline } from "react-icons/io5";
import { Button } from './ui/button'
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";


type Props = {
    position: { x: number, y: number } | null,
    onClose: () => void,
    handleAiChange:any,
    loading:boolean
}

const FloatingActionTool = ({ position, onClose,handleAiChange,loading }: Props) => {
    const [userAiPrompt, setUserAiPrompt] = useState<string>('')

    if (!position) return
    return (
        <div
            className='absolute z-50 bg-white 
             px-3 py-2 rounded-lg shadow-xl 
             border flex text-sm items-center'

            style={{
                top: position.y + 20,
                left: position.x,
                transform: "translateX(-50%)"
            }}

        >
            <div className="flex gap-2 items-center">
                <IoSparklesOutline className="h-4 z-4" />
                <input type="text" placeholder="Edit with AI"
                    className="outline-none border-none "
                    disabled={loading}
                    value={userAiPrompt}
                    onChange={(event)=>setUserAiPrompt(event.target.value)}
                />

                {userAiPrompt && <Button variant={'ghost'} size={'icon-sm'}
                onClick={()=> {handleAiChange(userAiPrompt);setUserAiPrompt('')}}
                >
                    <FaArrowRight className="h-4 w-4" />
                </Button>}
                {loading && <LuLoaderCircle className="animate-spin" />}
            </div>
            <Button variant={'ghost'} size={'icon-sm'}
                onClick={onClose}
            >
                X
            </Button>
        </div >
    )
}

export default FloatingActionTool