"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ModeToggle } from '@/components/ModeToggle'
import { ArrowUp, MessageCircleDashed } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { z } from "zod"
import axios from "axios"
import { BACKEND_URL } from "@/lib/config"
const formSchema = z.object({
  message: z.string().trim()
    .min(1, { message: "Message cannot be empty" })
    .refine((val) => val.replace(/\s/g, "").length > 0, {
      message: "Message cannot be only spaces or newlines",
    })

})
type Message = {
  id: string
  input: string
  answer: string
}
const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  let threadId;
  useEffect(() => {
    threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    axios.get(`${BACKEND_URL}/reset`, {
    })
      .then(function (response) {
        console.log("reset done")
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setMessages([...messages, { id: crypto.randomUUID(), input: String(values.message), answer: "Loading..." }])
    axios.post(`${BACKEND_URL}/chat`, {
      inputMessage: values.message as string,
      // threadId: threadId
    })
      .then(function (response) {
        setMessages([...messages, { id: crypto.randomUUID(), input: String(values.message), answer: String(response.data) }])
      })
      .catch(function (error) {
        console.log(error);
      });
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
        {
          messages.map((e) => {
            return (
              <div key={e.id} className="flex flex-col flex-wrap ">
                <p className='font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-96 self-end whitespace-pre-wrap break-all'>{e.input}</p>
                {
                  e.answer == "Loading..." ?
                    <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start whitespace-pre-wrap break-all animate-pulse'>{e.answer}</p>
                    : <p className='font-light py-1.5 px-3 rounded-xl my-5 self-start whitespace-pre-wrap break-all'>{e.answer}</p>
                }
              </div>
            )
          })
        }
      </div>
      <div className='fixed bottom-0 py-10 left-0 w-screen flex justify-center bg-background'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-[90vw] lg:w-[40vw] flex rounded-2xl bg-accent items-center p-3'>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea className='max-h-60 resize-none border-none mr-2' placeholder="Ask anything" {...field} onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }} />
                  </FormControl>
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