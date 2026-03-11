'use client';
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Authentication from "./Authentication"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { FaCoins } from "react-icons/fa";

const Navbar = () => {
    const user = useSelector((state: RootState) => state?.user)
    console.log(user)

    return (
        <div className="wrapper relative w-full text-xs md:text-lg">
            <nav className="flex justify-around items-center border border-b-gray-400 h-15 md:h-20 w-full fixed top-0 z-20 bg-white">
                <div className="logo w-10 md:w-15 h-10 md:h-15 rounded-full">
                    {user?.id && <Link href='/workspace'>
                        <img src="/logo.png" alt="Logo" />
                    </Link>}
                    {!user?.id && <Link href='/'>
                        <img src="/logo.png" alt="Logo" />
                    </Link>}
                </div>
                <div className="routes flex gap-4">
                    <Link href='/workspace'>Workspace</Link>
                    <Link href='/pricing'>Pricing</Link>
                </div>
                <div className="account">
                    {!user?.id &&
                        <div className="logged-out">
                            <Dialog>
                                <DialogTrigger>
                                    <div className="bg-primary hover:bg-green-500 px-3 sm:px-4 py-2 rounded-sm sm:rounded-md text-white text-xs sm:text-lg cursor-pointer">Get started</div>
                                </DialogTrigger>
                                <DialogContent >
                                    <DialogHeader>
                                        <DialogTitle></DialogTitle>
                                    </DialogHeader>
                                    <Authentication />
                                </DialogContent>
                            </Dialog>
                        </div>
                    }

                    {user?.id &&
                        <div className="logged-in flex items-center justify-center gap-2">
                            <div className="left flex justify-center items-center gap-1 bg-green-200 p-1 px-2 md:p-2 rounded-2xl font-bold">
                                <FaCoins size={20}/>
                                {user?.credits}
                            </div>
                            <div className="right bg-green-800 text-white rounded-full p-2 w-7 md:w-10 h-7 md:h-10 flex justify-center items-center cursor-pointer">
                                {user?.name?.[0]}
                            </div>
                            
                        </div>
                    }

                </div>
            </nav>
        </div>

    )
}

export default Navbar