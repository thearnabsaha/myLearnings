"use client"
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import React from 'react'

const page = () => {
    return (
        <div>
            <Button
                className="w-full"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
                Sign in with Google
            </Button>
        </div>
    )
}

export default page