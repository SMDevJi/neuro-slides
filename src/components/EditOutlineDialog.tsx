import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'


const EditOutlineDialog = ({ children, outlineData,onUpdate }: any) => {
    const [localData, setLocalData] = useState(outlineData)
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleDataChange = (field: string, value: string) => {
        setLocalData({ ...localData, [field]: value })
    }


    const handleUpdate = () => {
        onUpdate(outlineData?.slideNo,localData)
        setDialogOpen(false)
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <form >
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Edit Slide Outline</DialogTitle>

                        <div className='mt-3 '>
                            <label htmlFor="slideTitle">Slide Title</label>
                            <Input id='slideTitle'
                                placeholder='Slide Title'
                                value={localData.slidePoint}
                                onChange={(e) => handleDataChange('slidePoint', e.target.value)}
                            />
                        </div>


                        <div className='mt-3'>
                            <label htmlFor="slideOutline">Slide Outline</label>
                            <Textarea
                                id='slideOutline'
                                placeholder='Slide Outline'
                                value={localData.outline}
                                onChange={(e) => handleDataChange('outline', e.target.value)}
                            />
                        </div>

                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit"
                        className='cursor-pointer'
                            onClick={handleUpdate}
                        >Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default EditOutlineDialog