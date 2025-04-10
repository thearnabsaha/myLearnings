"use client"
import { useRouter } from "next/navigation"
const Signup = () => {
  const router=useRouter()
  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center -translate-y-10'>
      <h1 className='text-3xl'>You are in Signup page</h1>
      <button className=' border cursor-pointer mt-5 p-5' onClick={()=>router.push("/signin")}>Go to Sign In</button>
      <button className=' border cursor-pointer mt-5 p-5' onClick={()=>router.back()}>Back</button>
    </div>
  )
}

export default Signup