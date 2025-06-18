"use client"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { useRouter } from "next/navigation"

const Navbar = () => {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <div>
      {
        session && session.user?.image && (
          <Image
            src={session.user.image}
            alt="User avatar"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
        )
      }
      <AlertDialog>
        <AlertDialogTrigger>Log Out</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => signOut({ callbackUrl: "/signin" })}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Navbar