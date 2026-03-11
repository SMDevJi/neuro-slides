'use client';
import { Input } from "@/components/ui/input"
import React, { useState, useEffect } from "react"
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";
import axios from "axios";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

const LoginForm = () => {
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()


  const requestLogin = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (!email || !password) return

    try {
      setRequesting(true)
      const res = await signIn('credentials', {
        email, password, redirect: false
      })
      console.log(res)
      if (res && !res.ok) {
        if (res.error == 'CredentialsSignin') {
          setError('Invalid Credentials')
        } else if (res.error == 'Use Google login') {
          setError(res.error)
        } else {
          setError('Login Failed.')
        }
        return
      }
      toast.success('User logged in successfully!')
      router.push('/workspace')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setRequesting(false)
    }
  }

  return (
    <div>
      <h1 className="text-center text-xl font-semibold mt-2">Login</h1>
      <form
        onSubmit={(e) => requestLogin(e)}
      >
        <label htmlFor="email" className="ml-2">Email..</label>
        <Input type="email" id='email' placeholder="Enter Your Email"
          className="mt-2 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <label htmlFor="password" className="ml-2 ">Password..</label>
        <Input type="password" id='password' placeholder="Enter Password"
          className=" mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {requesting ? 'Logging in ..' : 'Login'}</button>

      </form>
      <div className="my-2 or flex items-center">
        <div className="p1 border w-full h-0 mr-2"></div>
        OR
        <div className="p2 border w-full h-0 ml-2"></div>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault()
        signIn('google', {
          callbackUrl: '/workspace'
        })
      }}>
        <button
          className='text-md flex justify-center items-center w-full bg-white hover:bg-gray-100 border-2 text-black rounded-md p-3 cursor-pointer'
        >
          <FcGoogle size={22} className='mr-2' />  Sign In With Google
        </button>
      </form>
    </div>
  )
}

export default LoginForm