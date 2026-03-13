import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    credits: number |"unlimited"
  }

  interface Session {
    user: {
      id: string
      credits: number |"unlimited"
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    credits: number |"unlimited"
  }
}