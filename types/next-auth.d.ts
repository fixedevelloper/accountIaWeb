import NextAuth from "next-auth"
import { Session, JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: number
            token: string
            name: string
            email: string
            role: string
            company: any | null
            phone: string
            image: string
        }
    }

    interface User {
        id: number
        token: string
        name: string
        email: string
        role: string
        company: any | null,
        phone: string
        image: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number
        token: string
        role: string
        company: any | null
        name: string
        email: string
        phone: string
        image: string
    }
}