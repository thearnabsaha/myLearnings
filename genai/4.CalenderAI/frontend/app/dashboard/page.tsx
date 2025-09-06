// app/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/signin")
    }

    return (
        <div>
            <h1>Welcome, {session.user?.name}!</h1>
            <p>Email: {session.user?.email}</p>
        </div>
    )
}