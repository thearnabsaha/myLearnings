"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ModeToggle } from '@/components/ModeToggle'
import { ArrowUp, MessageCircleDashed } from 'lucide-react'
import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
const formSchema = z.object({
  username: z.string().min(1)
})
const page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    form.reset()
  }
  return (
    <div className='mx-auto w-[90vw] lg:w-[50vw]'>
      <div className='flex items-center justify-between pt-2 fixed w-screen left-0 px-10 bg-background'>
        <div className='flex items-center'>
          <MessageCircleDashed />
          <h1 className='text-2xl'>TempChat</h1>
        </div>
        <ModeToggle />
      </div >
      <div className='flex flex-col flex-wrap mb-100 pt-10'>
        <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-72 self-end'>Arnab is the best person in the world</p>
        <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Arnab is the best person in the world</p>
        <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-72 self-end'>Lorem ipsum dolor sit amet.</p>
        <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor sit amet.</p>
        <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-72 self-end'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero minus distinctio commodi dignissimos perferendis ab necessitatibus nesciunt praesentium accusantium. Consequatur cum nam nulla error recusandae?</p>
        <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero minus distinctio commodi dignissimos perferendis ab necessitatibus nesciunt praesentium accusantium. Consequatur cum nam nulla error recusandae?</p>
        <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-72 self-end'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat corrupti assumenda nihil tenetur provident laudantium, dignissimos dolorem quae culpa accusamus impedit omnis nulla animi recusandae enim mollitia dolor nam expedita.</p>
        <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat corrupti assumenda nihil tenetur provident laudantium, dignissimos dolorem quae culpa accusamus impedit omnis nulla animi recusandae enim mollitia dolor nam expedita.</p>
        <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-72 self-end'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, perferendis?</p>
        <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, perferendis?</p>
        <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-72 self-end'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo vitae provident aliquid sint consequatur, eos sit eaque repudiandae itaque nihil numquam accusantium, porro, alias assumenda.</p>
        <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo vitae provident aliquid sint consequatur, eos sit eaque repudiandae itaque nihil numquam accusantium, porro, alias assumenda.</p>
        <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-72 self-end'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore dolore, nobis in ullam dicta numquam.</p>
        <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore dolore, nobis in ullam dicta numquam.</p>
      </div>
      <div className='fixed bottom-0 py-10 left-0 w-screen flex justify-center bg-background'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-[90vw] lg:w-[40vw] flex rounded-2xl bg-accent items-center p-3'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea className='max-h-60 resize-none border-none mr-2' placeholder="Ask anything" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='cursor-pointer rounded-4xl h-8 w-8 mr-2' type="submit"><ArrowUp /></Button>
          </form>
        </Form>
      </div >
    </div >
  )
}

export default page