// app/auth/signin/page.tsx
"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Continue with your Google account
                    </p>
                </div>
                <Button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full"
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        {/* Google icon SVG */}
                    </svg>
                    Sign in with Google
                </Button>
            </div>
        </div>
    )
}