'use client';
import { clearUser, setUser } from '@/redux/userSlice'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const AuthSync = () => {
    const { data: session, status } = useSession()
    const dispatch = useDispatch()


    useEffect(() => {
        if (status !== 'loading') {
            if (session?.user) {
                dispatch(setUser({
                    id: session.user.id ?? null,
                    name: session.user.name ?? null,
                    email: session.user.email ?? null,
                    image: session.user.image ?? null,
                    credits: session.user.credits ?? 0
                }))
            } else {
                dispatch(clearUser())
            }
        }
    }, [status, dispatch, session?.user])

    return null
}

export default AuthSync