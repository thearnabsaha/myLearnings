"use client" // <-- tells Next.js this file should run on the client

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <Button onClick={() => alert("i love you!")}>Click me</Button>
    </div>
  )
}
