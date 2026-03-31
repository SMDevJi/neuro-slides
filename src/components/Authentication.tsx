'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";
import axios from "axios";
import { VscLoading } from "react-icons/vsc";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "sonner";
import LoginForm from "./LoginForm";
import { motion, AnimatePresence } from 'framer-motion';

//https://www.shadcn.io/patterns/dialog-standard-17

const Authentication = () => {
    const [activeTab, setActiveTab] = useState("signup")
    const [currentStep, setCurrentStep] = useState(0)
    const [requesting, setRequesting] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setCPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [resending, setResending] = useState(false)

    const router = useRouter()


    useEffect(() => {
        const countdown = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prev => prev - 1);
            } else {
                if (minutes === 0) {
                    clearInterval(countdown);
                } else {
                    setMinutes(prev => prev - 1);
                    setSeconds(59);
                }
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [minutes, seconds]);

    const formatTime = (value: any) => value.toString().padStart(2, '0');



    const requestOtp = async () => {
        if (requesting) return

        if (!email.includes("@")) {
            setError("Enter valid email")
            return
        }
        try {
            setRequesting(true)
            const resp = await axios.post('/api/auth/send-otp', {
                email
            })
            console.log(resp.data)
            setMinutes(resp.data?.otpValidMins)
            toast.success('OTP sent successfully!')
            setError(null)
            handleNext()
        } catch (err: any) {
            const status = err?.response?.status

            if (status === 409) {
                toast.error("User already exists. Please login.")
                setActiveTab('login')
                setCurrentStep(0)
                return
            }
            console.log(err.response?.data?.message || err.message)
            setError('Failed to send OTP')
        } finally {
            setRequesting(false)
        }
    }

    const resendOtp = async () => {
        if (resending || requesting) return
        if (minutes != 0 || seconds != 0) {
            return
        }

        if (!email.includes("@")) {
            setError("Enter valid email")
            return
        }
        try {
            setResending(true)
            const resp = await axios.post('/api/auth/resend-otp', {
                email
            })
            console.log(resp.data)
            setMinutes(resp.data?.otpValidMins)
            toast.success('OTP resent successfully!')
        } catch (err: any) {
            console.log(err.response?.data?.message || err.message)
            setError('Failed to resend OTP')
        } finally {
            setResending(false)
        }
    }

    const validateOtp = async () => {
        if (requesting || resending) return
        if (otp.length !== 6) return
        try {
            setRequesting(true)
            const resp = await axios.post('/api/auth/verify-otp', {
                email, otp
            })
            console.log(resp.data)
            toast.success('Email verified successfully!')
            setError(null)
            handleNext()
        } catch (err: any) {
            console.log(err.response?.data?.message || err.message)
            setError('Failed to validate OTP')
        } finally {
            setRequesting(false)
        }
    }


    const registerUser = async () => {
        if (requesting) return

        if (password !== cpassword) {
            setError("Confirm password doesn't match")
            return
        } else {
            setError(null)
        }
        try {
            setRequesting(true)
            const resp = await axios.post('/api/auth/register', {
                email, name, password
            })
            console.log(resp.data)
            toast.success('User registered successfully!')
            setError(null)
            setCurrentStep(0)

            setEmail('')
            setName('')
            setPassword('')
            setCPassword('')
            setOtp('')
            setActiveTab('login')
        } catch (err: any) {
            const status = err?.response?.status

            if (status === 409) {
                toast.error("User already exists. Please login.")
                setActiveTab('login')
                setCurrentStep(0)
                return
            }
            console.log(err.response?.data?.message || err.message)
            setError('Failed to register user')
        } finally {
            setRequesting(false)
        }
    }

    const steps: React.ReactNode[] = [
        (
            <div className="">
                <form onSubmit={(e: React.SubmitEvent) => {
                    e.preventDefault()
                    requestOtp()
                }}
                >
                    <label htmlFor="email" className="ml-2">Email..</label>
                    <Input type="email" id='email' placeholder="Enter Your Email"
                        className="mt-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {error &&
                        <p className='text-red-300 font-normal text-center my-1'>{error}</p>
                    }
                    <button
                        type="submit"
                        disabled={requesting}
                        className="cursor-pointer bg-primary w-full p-2 rounded-md text-white mt-4 flex justify-center items-center gap-2"
                    >
                        {requesting ? <VscLoading size={22} className="animate-spin" /> : ''}
                        {requesting ? 'Sending OTP ..' : 'Send OTP'}</button>

                </form>
                <div className="my-2 or flex items-center">
                    <div className="p1 border w-full h-0 mr-2"></div>
                    OR
                    <div className="p2 border w-full h-0 ml-2"></div>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault()
                    signIn('google', {
                        callbackUrl: '/'
                    })
                }}>
                    <button
                        className='text-md flex justify-center items-center w-full bg-white hover:bg-gray-100 border-2 text-black rounded-md p-3 cursor-pointer'
                    >
                        <FcGoogle size={22} className='mr-2' />  Sign Up With Google
                    </button>
                </form>
            </div>
        ),
        (
            <div className="">
                <form onSubmit={(e: React.SubmitEvent) => {
                    e.preventDefault()
                    validateOtp()
                }}
                >
                    <h1 className="mb-3 text-center">Enter OTP sent to <br /><span className="font-semibold">{email}</span>..</h1>

                    <div className="otp-con flex justify-center l">
                        <InputOTP maxLength={6}
                            id="otpip"
                            value={otp}
                            onChange={(value) => {
                                const numericValue = value.replace(/\D/g, "");
                                setOtp(numericValue);
                            }}
                            className="w-full"
                        >
                            <InputOTPGroup className="">
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />

                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>


                    {error &&
                        <p className='text-red-300 font-normal text-center my-1'>{error}</p>
                    }


                    <div className="flex w-full justify-between text-center text-sm text-gray-600 mt-2">

                        Resend OTP in: {formatTime(minutes)}:{formatTime(seconds)}
                        <span onClick={resendOtp} className={`font-semibold  ${resending ? 'text-gray-400 hover:text-gray-400' : 'hover:text-gray-800'} ml-2 cursor-pointer`}>
                            {resending ? 'Resending code...' : 'Resend code'}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={requesting}
                        className="cursor-pointer bg-primary w-full p-2 rounded-md text-white mt-4 flex justify-center items-center gap-2"
                    >
                        {requesting ? <VscLoading size={22} className="animate-spin" /> : ''}
                        {requesting ? 'Verifying OTP ..' : 'Verify OTP'}</button>

                </form>
            </div>
        ),

        (
            <div className="">
                <form onSubmit={(e: React.SubmitEvent) => {
                    e.preventDefault()
                    registerUser()
                }}
                >
                    <label htmlFor="email" className="ml-2">Your Email..</label>
                    <Input type="email" id='email'
                        className="mt-2 mb-2"
                        value={email}
                        disabled
                    />

                    <label htmlFor="name" className="ml-2">Your Name..</label>
                    <Input type="text" id='name' placeholder="Enter Your Full Name"
                        className="mt-2 mb-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label htmlFor="password" className="ml-2 ">Password..</label>
                    <Input type="password" id='password' placeholder="Enter Password"
                        className="mt-2 mb-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label htmlFor="cpassword" className="ml-2 ">Confirm Password..</label>
                    <Input type="password" id='cpassword' placeholder="Confirm Password"
                        className="mt-2"
                        value={cpassword}
                        onChange={(e) => setCPassword(e.target.value)}
                    />

                    {error &&
                        <p className='text-red-300 font-normal text-center my-1'>{error}</p>
                    }
                    <button
                        type="submit"
                        disabled={requesting}
                        className="cursor-pointer bg-primary w-full p-2 rounded-md text-white mt-4 flex justify-center items-center gap-2"
                    >
                        {requesting ? <VscLoading size={22} className="animate-spin" /> : ''}
                        {requesting ? 'Registering ..' : 'Register'}</button>

                </form>
            </div>
        )

    ]






    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    return (
        <Tabs
            value={activeTab} onValueChange={setActiveTab}
            className="w-full  ">
            <TabsList className="w-full h-10 gap-3 mt-3">
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:tracking-wider cursor-pointer text-black  md:h-10 md:text-lg">Signup</TabsTrigger>
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:tracking-wider cursor-pointer text-black md:h-10 md:text-lg">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="signup" >
                <div className="space-y-6">
                    <h1 className="text-center text-xl font-semibold mt-2">Sign Up</h1>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep} // <--- key forces re-mount on step change
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }} // optional exit animation
                            transition={{ duration: 0.4 }}
                        >
                            {steps[currentStep]}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-center">
                        <div className="flex gap-2">
                            {steps.map((_, index) => (
                                <div
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-colors",
                                        index === currentStep ? "bg-primary" : "bg-gray-200",
                                    )}
                                    key={index}
                                />
                            ))}
                        </div>
                        {/* <div className="flex gap-4">
                           
                            <Button onClick={handleNext}>
                                {currentStep === steps.length - 1 ? "Complete Signup" : "Next"}
                            </Button>
                        </div> */}
                    </div>
                </div>
            </TabsContent>










            <TabsContent value="login">
                <LoginForm />
            </TabsContent>
        </Tabs>
    )
}

export default Authentication