// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async session({ session, token, user }) {
            // Send properties to the client
            if (session.user) {
                session.user.id = user.id
            }
            return session
        },
        async jwt({ token, user, account, profile }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        }
    },
    // pages: {
    //     signIn: '/auth/signin', // Optional: custom sign-in page
    //     error: '/auth/error',   // Optional: custom error page
    // },
    session: {
        strategy: "database", // Use database sessions
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }