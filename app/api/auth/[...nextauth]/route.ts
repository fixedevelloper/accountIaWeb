import NextAuth, {NextAuthOptions, Session} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"
import {JWT} from "next-auth/jwt";

export const authOptions: NextAuthOptions = {  // ✅ Typé NextAuthOptions
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials: { email?: string; password?: string } | undefined) {
                try {
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/login`,
                        {
                            email: credentials?.email,
                            password: credentials?.password,
                        },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    const result = res.data;

                    return {
                        id: result.user.id,
                        token: result.token,
                        image: result.user.image,
                        phone: result.user.phone,
                        name: result.user.name,
                        email: result.user.email,
                        role: result.user.role,
                        company: result.company || null,
                    };
                } catch (error: any) {
                    // ... votre gestion d'erreur existante
                    throw new Error(error?.message || "LOGIN_FAILED");
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: any }) {  // ✅ Typé JWT
            if (user) {
                token.id = user.id;
                token.token = user.token;
                token.role = user.role;
                token.company = user.company;
                token.image= user.image,
                    token.phone= user.phone,
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {  // ✅ Typé Session + JWT
            if (session.user && token) {
                session.user.id = token.id as number;
                session.user.token = token.token as string;
                session.user.role = token.role as string;
                session.user.company = token.company;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.phone = token.phone as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }