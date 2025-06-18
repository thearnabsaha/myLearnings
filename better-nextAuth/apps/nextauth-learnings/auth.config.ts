import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@workspace/db/client";

const authConfig: NextAuthConfig = {
    providers: [
        GitHub,
        Google,
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                name: {
                    type: "name",
                    label: "name",
                    placeholder: "jhon doe",
                },

            },
            async authorize(credentials) {
                const { email, name } = credentials as { email: string; name: string };

                if (!email || !name) return null;

                // Check if user exists in the database
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (existingUser) {
                    return existingUser; // Return user object to sign in
                }

                // Otherwise, create the user
                const newUser = await prisma.user.create({
                    data: {
                        email,
                        name,
                    },
                });

                return newUser;
            },
        })
    ],
    secret: process.env.AUTH_SECRET as string,
    pages: {
        signIn: "/signin",
        signOut: "/logout",
        // newUser: "/dasboard",
    },
};

export default authConfig;