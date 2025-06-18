"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-center text-2xl font-bold">Welcome</h2>
                    <p className="text-center text-gray-500">
                        Sign in with one of the options below:
                    </p>
                    <div className="mt-6 flex flex-col gap-4">
                        <button
                            className="btn"
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        >
                            Sign in with Google
                        </button>
                        <button
                            className="btn"
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        >
                            Sign in with GitHub
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}