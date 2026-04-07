import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "./db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

const authoptions: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                const email = credentials?.email
                const password = credentials?.password

                if (!email || !password) {
                    throw new Error('credentials not provided')
                }

                await connectDB()
                const existUser = await User.findOne({ email: email.toLowerCase().trim() })
                if (!existUser) {
                    throw new Error('user does not exist')
                }

                if (!existUser.password) {
                    throw new Error("Use Google login")
                }

                const isMatch = await bcrypt.compare(password, existUser.password)

                if (isMatch) {
                    return {
                        id: existUser._id.toString(),
                        name: existUser.name,
                        email: existUser.email,
                        image: existUser.image,
                        credits: existUser.credits
                    }
                }

                return null
            }
        })
    ],
    callbacks: {
        async signIn({ account, user }) {
            if (account?.provider == 'google') {
                await connectDB()

                let existUser = await User.findOne({ email: user.email?.toLowerCase().trim() })

                if (!existUser) {
                    existUser = await User.create({
                        name: user.name,
                        email: user.email?.toLowerCase().trim(),
                        image: user.image
                    })
                }
                user.id = existUser._id.toString()
                user.name = existUser.name
                user.email = existUser.email
                user.image = existUser.image
                user.credits = existUser.credits
            }
            return true
        },
        async jwt({ token, user, trigger, session }) {

            // first login
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
                token.credits = user.credits
            }

            // when update() is called
            if (trigger === "update") {
                console.log(session.credits)
                if (session?.name) token.name = session.name
                if (session?.image) token.image = session.image
                if (session?.credits !== undefined) token.credits = session.credits;
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image as string
                session.user.credits = token.credits
            }
            return session
        }
    },
    session: {
        strategy: 'jwt'
    },
    jwt: {
        maxAge: 60 * 60 * 24
    },
    pages: {
        signIn: '/authenticate',
        error: '/authenticate'
    },
    secret: process.env.NEXTAUTH_SECRET
}

export default authoptions;