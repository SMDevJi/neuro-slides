import authoptions from "@/lib/auth";
import uploadOnCloudinary, { deleteFile } from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest) {
    try {
        await connectDB()

        const session = await getServerSession(authoptions)
        const formdata = await req.formData()

        const file = formdata.get('file') as Blob
        const name = formdata.get('name') as string

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        let imgUrl;

        if (file) {
            imgUrl = await uploadOnCloudinary(file)

            const user = await User.findById(session?.user?.id)
            //console.log(user)
            if (user?.image && user?.image.includes('cloudinary')) {
                //console.log('reached.')
                await deleteFile(user?.image)
            }
        }
        //console.log(name,file,imgUrl)
        const updatedUser = await User.findByIdAndUpdate(session?.user?.id, {
            name, image: imgUrl
        }, { new: true })

        if (!updatedUser) {
            return NextResponse.json(
                { message: 'user does not exist' },
                { status: 400 }
            )
        }
        //console.log(updatedUser)
        return NextResponse.json(
            updatedUser,
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: `error updating user ${error}` },
            { status: 500 }
        )
    }
}