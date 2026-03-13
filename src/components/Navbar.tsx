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
import { FaCoins } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import Image from 'next/image';

import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import axios from "axios";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

import { IoIosLogOut } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import { TiInfinity } from "react-icons/ti";

const Navbar = () => {
    const [open, setOpen] = useState(false)

    const { data: session, update } = useSession()
    const user = session?.user
    console.log(user)


    const [error, setError] = useState<null | string>(null)
    const [editName, setEditName] = useState('')
    const [frontendImg, setFrontendImg] = useState('')
    const [backendImg, setBackendImg] = useState<File | undefined>()
    const [updating, setUpdating] = useState(false)


    const imgRef = useRef<HTMLInputElement>(null)


    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (!files || files.length == 0) return

        setBackendImg(files[0])
        setFrontendImg(URL.createObjectURL(files[0]))
    }


    const editUser = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (updating) return
        if (!editName) return

        try {
            setUpdating(true)
            const formdata = new FormData()
            formdata.append('name', editName)
            if (backendImg) {
                formdata.append('file', backendImg)
            }
            const res = await axios.patch('/api/edit', formdata)

            await update({
                name: res.data.name,
                image: res.data.image
            })
            toast.success('Details updated successfully!')
            setOpen(false)
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message)
        } finally {
            setUpdating(false)
        }
    }


    useEffect(() => {
        setEditName(user?.name ?? '')
        setFrontendImg(user?.image ?? '')
    }, [user])

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
                                <FaCoins size={20} />
                                {user?.credits === 'unlimited' ? <TiInfinity /> : user?.credits}
                            </div>

                            <div className="right flex justify-center">
                                <div className="dd relative group inline-block">
                                    {user?.image &&
                                        <Image
                                            src={user?.image}
                                            width={20}
                                            height={20}
                                            alt='User Image'
                                            className='overflow-hidden rounded-full w-10 h-10 object-cover cursor-pointer'
                                        />
                                    }
                                    {!user?.image &&
                                        <button
                                            className=" bg-green-800 text-white rounded-full p-2 w-7 md:w-10 h-7 md:h-10 flex justify-center items-center cursor-pointer">
                                            {user?.name?.[0]}
                                        </button>
                                    }



                                    <div className="absolute left-1/2 -translate-x-[90%] top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300  bg-white border rounded-md shadow-lg">
                                        <ul className="p-3">
                                            <li className="flex items-center justify-start px-1 mb-2">
                                                <div className="pf-img w-10 h-10">
                                                    {user?.image &&
                                                        <Image
                                                            src={user?.image}
                                                            width={20}
                                                            height={20}
                                                            alt='User Image'
                                                            priority
                                                            className='overflow-hidden rounded-full w-10 h-10 object-cover cursor-pointer'
                                                        />
                                                    }
                                                    {!user?.image &&
                                                        <p
                                                            className=" bg-green-800 text-white rounded-full p-2 w-8 h-8 text-xl flex justify-center items-center ">
                                                            {user?.name?.[0]}
                                                        </p>
                                                    }

                                                </div>
                                                <div className="details ml-2">
                                                    <p>{user?.name}</p>
                                                    <p>{user?.email}</p>
                                                </div>
                                            </li>
                                            <li className="flex items-center">
                                                <FaUserEdit size={15} />

                                                <Dialog open={open} onOpenChange={setOpen}>
                                                    <DialogTrigger className="w-full">
                                                        <h1 className=" text-left block p-2 hover:bg-gray-100 cursor-pointer w-full" >
                                                            Edit Profile
                                                        </h1>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle></DialogTitle>
                                                            <form
                                                                onSubmit={editUser}
                                                                className="relative profile w-full h-full  flex flex-col items-center p-3"
                                                            >


                                                                <div className="pic flex hover:text-green-300 hover:outline-3 rounded-full cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        imgRef?.current?.click()
                                                                    }}
                                                                >
                                                                    <input type="file"
                                                                        accept="image/*"
                                                                        ref={imgRef}
                                                                        onChange={(e) => handleImgChange(e)}
                                                                        hidden
                                                                    />

                                                                    {frontendImg ?
                                                                        <Image
                                                                            src={frontendImg}
                                                                            width={70}
                                                                            height={70}
                                                                            alt='User Image'
                                                                            className='overflow-hidden rounded-full w-17.5 h-17.5 object-cover'
                                                                        />
                                                                        :
                                                                        <div className="pf-img">
                                                                            <p
                                                                                className=" bg-green-800 text-white rounded-full  w-17.5 h-17.5 flex justify-center items-center cursor-pointer text-3xl">
                                                                                {user?.name?.[0]}
                                                                            </p>
                                                                        </div>

                                                                    }
                                                                </div>



                                                                <label htmlFor="name" className="text-xl mt-2">Name..</label>
                                                                <Input type="name" id='name' placeholder="Enter Your Email"
                                                                    className=" mb-2"
                                                                    value={editName}
                                                                    onChange={(e) => setEditName(e.target.value)}
                                                                />



                                                                {error &&
                                                                    <p className='text-red-300 font-normal text-center my-1'>{error}</p>
                                                                }
                                                                <button
                                                                    type="submit"
                                                                    disabled={updating}
                                                                    className="cursor-pointer bg-primary w-full p-2 rounded-md text-white mt-4 flex justify-center items-center gap-2"
                                                                >
                                                                    {updating ? <VscLoading size={22} className="animate-spin" /> : ''}
                                                                    {updating ? 'Updating Profile ..' : 'Update Profile'}</button>

                                                            </form>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>

                                            </li>
                                            <hr />
                                            <li className="flex items-center">
                                                <FaCoins size={11} />
                                                <Link className="block p-2 hover:bg-gray-100" href="pricing">
                                                    Buy Credits
                                                </Link>
                                            </li>
                                            <hr />
                                            <li className="flex items-center">
                                                <IoIosLogOut size={15} />
                                                <button
                                                    onClick={() => {
                                                        signOut({
                                                            callbackUrl: '/'
                                                        })
                                                    }}
                                                    className="block p-2 hover:bg-gray-100 w-full text-left cursor-pointer">
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </div>



                        </div>
                    }

                </div>
            </nav>
        </div>

    )
}

export default Navbar