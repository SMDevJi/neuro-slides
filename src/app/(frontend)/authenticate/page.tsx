"use client"
import Authentication from "@/components/Authentication"
import LoginForm from "@/components/LoginForm"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()

    return (
        <div className="min-h-[75vh]">
            <Dialog open onOpenChange={() => router.back()}>
                <DialogContent>
                    <DialogTitle></DialogTitle>
                    <Authentication/>
                </DialogContent>
            </Dialog>
        </div>
    )
}