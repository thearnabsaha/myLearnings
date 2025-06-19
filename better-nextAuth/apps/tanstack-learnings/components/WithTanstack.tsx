"use client"
import React, { useState } from 'react'
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { getPost, getPosts } from '@/queries/posts';
import { useQueries, useQuery } from '@tanstack/react-query'

const WithTanstack = () => {
    const [id, setId] = useState(1)
    // const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({ queryKey: ['posts'], queryFn: getPosts })
    // const { data: post, isLoading: postLoading, error: postError } = useQuery({ queryKey: ['post',id], queryFn: () => getPost(id), enabled: !!id})
    const [posts,post] = useQueries({
        queries:[
            { queryKey: ['posts'], queryFn: getPosts },
            { queryKey: ['post',id], queryFn: () => getPost(id), enabled: !!id}
        ]
    })
    posts.error&&console.log(posts.error)
    post.error&&console.log(post.error)
    return (
        <div>
            <h1>WithTanstack</h1>
            <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 overflow-auto">
                {
                    posts.data?.map((e) => {
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
                    posts.isLoading && <div>
                        <Skeleton className="h-[20px] w-[40px] rounded-md bg-secondary" />
                        <Skeleton className="h-[20px] w-[200px] rounded-md bg-secondary mt-2" />
                        <Skeleton className="h-[90px] w-[300px] rounded-md bg-secondary mt-2" />
                    </div>
                }
            </ScrollArea>
            <div className='pt-10'>
                <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 overflow-auto">
                    {
                        post.isLoading ? <div>
                            <Skeleton className="h-[20px] w-[40px] rounded-md bg-secondary" />
                            <Skeleton className="h-[20px] w-[200px] rounded-md bg-secondary mt-2" />
                            <Skeleton className="h-[90px] w-[300px] rounded-md bg-secondary mt-2" />
                        </div> : <div>
                            <div>
                                <span>{post.data?.userId}</span>
                                <span>,</span>
                                <span>{post.data?.id}</span>
                            </div>
                            <h1>{post.data?.title}</h1>
                            <h1>{post.data?.body}</h1>
                        </div>
                    }
                </ScrollArea>
                <Button onClick={() => setId(prev => prev == 1 ? prev : prev - 1)} className='m-2' disabled={post.data?.id == 1}>Prev</Button>
                <Button onClick={() => setId(prev => prev + 1)}>Next</Button>
            </div>
        </div>
    )
}

export default WithTanstack