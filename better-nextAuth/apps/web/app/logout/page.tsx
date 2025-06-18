"use client"
import { signOut } from 'next-auth/react';
import React, { useEffect } from 'react'

const logout = () => {
    useEffect(() => {
        // Automatically sign out when the page loads
        signOut({ callbackUrl: "/" });
    }, []);
    return (
        <div></div>
    )
}

export default logout