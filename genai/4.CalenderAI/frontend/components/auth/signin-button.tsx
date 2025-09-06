// components/auth/signin-button.tsx
"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignInButton() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <Button disabled>Loading...</Button>
    }

    if (session) {
        return (
            <div className="flex items-center gap-4">
                <span>Welcome, {session.user?.name}</span>
                <Button onClick={() => signOut()}>Sign Out</Button>
            </div>
        )
    }

    return (
        <Button onClick={() => signIn("google")}>
            Sign in with Google
        </Button>
    )
}