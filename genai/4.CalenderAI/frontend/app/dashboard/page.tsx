"use client"
import { useSession, signIn, signOut } from "next-auth/react"
// import { useEffect } from "react"
import { useRouter } from 'next/navigation'
export default function Component() {
    const { data: session } = useSession()
    // const router = useRouter()
    // useEffect(() => {
    //     if (!session?.user) {
    //         // router.push('/cred')
    //     }
    // }, [session])
    // console.log(session)
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut({ callbackUrl: "/cred" })}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}