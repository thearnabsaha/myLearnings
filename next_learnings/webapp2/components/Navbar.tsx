import React from 'react'
import { ModeToggle } from './ModeToggle'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='flex justify-around '>
        <Link href="/">Home</Link>
        <Link href="/signup">Sign Up</Link>
        <Link href="/signin">Sign In</Link>
        <ModeToggle/>
    </div>
  )
}

export default Navbar