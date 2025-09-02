// frontend/app/page.tsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session) return <button onClick={() => signIn("google")}>Sign in with Google</button>;

  return (
    <div>
      <p>Hi {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
