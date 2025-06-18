import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

const authConfig: NextAuthConfig = {
    providers: [
        GitHub,
        Google
    ],
    secret: process.env.AUTH_SECRET as string,
    pages: {
        signIn: "/signin",
        signOut: "/logout",
        // newUser: "/dasboard",
    },
};

export default authConfig;