"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function LogOutPage() {
    return (
        <main className="flex h-screen items-center justify-center">
            <div className="card w-full max-w-md shadow-lg rounded-lg">
                <div className="card-body p-6 bg-base-100">
                    <h2 className="text-2xl font-bold mb-4">Logout</h2>
                    <p className="mb-6">Are you sure you want to logout?</p>
                    <div className="card-actions flex justify-end space-x-4">
                        <Link href="/" className="btn btn-outline btn-primary">
                            Cancel
                        </Link>
                        <button
                            className="btn btn-secondary"
                            onClick={() => signOut({ callbackUrl: "/signin" })}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}