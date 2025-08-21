import { ModeToggle } from '@/components/ModeToggle'
import { MessageCircleDashed } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className='mx-auto w-[50vw]'>
      <div className='flex items-center justify-between mt-2'>
        <div className='flex items-center'>
          <MessageCircleDashed />
          <h1 className='text-2xl'>TempChat</h1>
        </div>
        <ModeToggle />
      </div >
      <div>
        <div className='flex flex-col flex-wrap'>
          <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-56 self-end'>Arnab is the best person in the world</p>
          <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Arnab is the best person in the world</p>
          <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-56 self-end'>Lorem ipsum dolor sit amet.</p>
          <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor sit amet.</p>
          <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-56 self-end'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero minus distinctio commodi dignissimos perferendis ab necessitatibus nesciunt praesentium accusantium. Consequatur cum nam nulla error recusandae?</p>
          <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero minus distinctio commodi dignissimos perferendis ab necessitatibus nesciunt praesentium accusantium. Consequatur cum nam nulla error recusandae?</p>
          <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-56 self-end'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat corrupti assumenda nihil tenetur provident laudantium, dignissimos dolorem quae culpa accusamus impedit omnis nulla animi recusandae enim mollitia dolor nam expedita.</p>
          <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat corrupti assumenda nihil tenetur provident laudantium, dignissimos dolorem quae culpa accusamus impedit omnis nulla animi recusandae enim mollitia dolor nam expedita.</p>
          <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-56 self-end'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, perferendis?</p>
          <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, perferendis?</p>
          <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-56 self-end'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo vitae provident aliquid sint consequatur, eos sit eaque repudiandae itaque nihil numquam accusantium, porro, alias assumenda.</p>
          <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo vitae provident aliquid sint consequatur, eos sit eaque repudiandae itaque nihil numquam accusantium, porro, alias assumenda.</p>
          <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-56 self-end'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore dolore, nobis in ullam dicta numquam.</p>
          <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore dolore, nobis in ullam dicta numquam.</p>
        </div>
      </div>
    </div>
  )
}

export default page