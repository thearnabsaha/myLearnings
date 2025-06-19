"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Skeleton } from "@workspace/ui/components/skeleton"
interface DataInterface {
  id: string;
  userId: string;
  title: string;
  body: string;
}
const WithoutTanstack = () => {
  const [data, setdata] = useState<DataInterface[]>([])
  const [post, setpost] = useState<DataInterface>()
  const [loading, setloading] = useState(true)
  const [id, setid] = useState(1)
  useEffect(() => {
    try {
      axios.get("https://jsonplaceholder.typicode.com/posts")
        .then((e) => {
          setdata(e.data)
          setloading(false)
        })
        .catch((e) => console.log(e))
    } catch (error) {
      console.log(error)
    }
  }, [])
  useEffect(() => {
    try {
      axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((e) => {
          setpost(e.data)
          setloading(false)
        })
        .catch((e) => console.log(e))
    } catch (error) {
      console.log(error)
    }
  }, [id])
  return (
    <div>
      <h1>WithoutTanstack</h1>
      <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 overflow-auto">
        {
          data.map((e) => {
            return (
              <div key={e.id}>
                <div>
                  <span>{e.userId}</span>
                  <span>,</span>
                  <span>{e.id}</span>
                </div>
                <h1 className=' font-black pb-1'>{e.title}</h1>
                <h1>{e.body}</h1>
                <hr />
              </div>
            )
          })
        }
        {
          loading && <div>
            <Skeleton className="h-[20px] w-[40px] rounded-md bg-secondary" />
            <Skeleton className="h-[20px] w-[200px] rounded-md bg-secondary mt-2" />
            <Skeleton className="h-[90px] w-[300px] rounded-md bg-secondary mt-2" />
          </div>
        }
      </ScrollArea>
      <div className='pt-10'>
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 overflow-auto">
          {
            loading ? <div>
              <Skeleton className="h-[20px] w-[40px] rounded-md bg-secondary" />
              <Skeleton className="h-[20px] w-[200px] rounded-md bg-secondary mt-2" />
              <Skeleton className="h-[90px] w-[300px] rounded-md bg-secondary mt-2" />
            </div>:        <div>
            <div>
              <span>{post?.userId}</span>
              <span>,</span>
              <span>{post?.id}</span>
            </div>
            <h1>{post?.title}</h1>
            <h1>{post?.body}</h1>
          </div>
          }
        </ScrollArea>
          <Button onClick={()=>setid(prev=>prev==1?prev:prev-1)} className='m-2'>Prev</Button>
          <Button onClick={()=>setid(prev=>prev+1)}>Next</Button>
      </div>
      </div>
  )
}

export default WithoutTanstack