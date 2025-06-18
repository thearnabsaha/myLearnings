import Link from "next/link"
import  auth  from "@/auth";
export default async function Page() {
  const session = await auth.auth()
  console.log(session)
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
    <div>
      {session ? (
        <>
          <p>You are logged in as {session.user?.name}</p>
          <Link href="/api/auth/signout">Sign out</Link>
        </>
      ) : (
        <>
          <p>You are not logged in</p>
          <Link href="/api/auth/signin">Sign in</Link>
        </>
      )}
    </div>
      </div>
    </div>
  )
}
