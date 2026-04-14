import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Authentication from "@/components/Authentication"

const page = () => {
    return (
        <div className="">
            <section className="min-h-[75vh] flex flex-col justify-center items-center text-center px-6">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 mt-30 ">Neuro Slides - PPT Maker</h1>
                <p className="text-xl md:text-2xl mb-8">Create Stunning Presentations Instantly</p>
                <p className="mb-6 max-w-md md:max-w-xl">Turn your ideas into professional slides in seconds. No design skills needed—just type prompt and let AI do the rest.</p>

                <Dialog>
                    <DialogTrigger>
                        <div className="bg-primary hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-md text-xs sm:text-lg cursor-pointer">Get Started Now</div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle></DialogTitle>
                            <Authentication />

                        </DialogHeader>
                    </DialogContent>
                </Dialog>


            </section>


            <section className=" px-3">
                <div className="max-w-6xl mx-auto flex flex-col items-center ">
                    <h1 className="text-center text-2xl md:text-3xl mb-3 mt-5">Generate ppt with one prompt</h1>
                    <video
                        className="w-full md:w-[75%] rounded-lg"
                        src="NeuroSlides.mp4" autoPlay
                        muted
                        loop />
                </div>
            </section>


            <section className="py-16 bg-white text-center">
                <h2 className="text-3xl font-bold mb-10">Features</h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-3 px-5">
                    <div className="p-6 bg-green-100 rounded-lg  hover:scale-105 transition transform cursor-pointer">
                        <h3 className="text-xl font-semibold mb-2">Instant Slides</h3>
                        <p>Generate slides instantly from your prompt.</p>
                    </div>
                    <div className="p-6 bg-green-100 rounded-lg  hover:scale-105 transition transform cursor-pointer">
                        <h3 className="text-xl font-semibold mb-2">Templates</h3>
                        <p>Choose from ready-made templates for any style.</p>
                    </div>
                    <div className="p-6 bg-green-100 rounded-lg  hover:scale-105 transition transform cursor-pointer">
                        <h3 className="text-xl font-semibold mb-2">Export Easily</h3>
                        <p>Customize and download in PowerPoint PPT format.</p>
                    </div>
                </div>
            </section>




        </div>
    )
}

export default page