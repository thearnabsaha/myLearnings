"use client"
import { useSession } from "next-auth/react"
import React from 'react'
import  auth  from "@/auth";
const Dashboard = () => {
    const { data: session } = useSession()
  return (
    <div>
      <h1>Dashboard</h1>
      {
        session&&<div>
          <p>{session.user?.email}</p>
          <p>{session.user?.id}</p>
          <p>{session.user?.image}</p>
          <p>{session.user?.name}</p>
        </div>
      }
    </div>
  )
}

export default Dashboard