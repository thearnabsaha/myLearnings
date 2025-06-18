"use client";

import { Button } from "@workspace/ui/components/button";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
})
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
export default function LoginPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        signIn("credentials", values)
    }
    const { data: session, status } = useSession()
    useEffect(() => {
        if (status === "authenticated") {
            redirect("/dashboard")
        }
    }, [status])
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
                <div className="card-body">
                    <div className="mt-6 flex gap-4">
                        <Button
                            className="btn"
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        >
                            Sign in with Google
                        </Button>
                        <Button
                            className="btn"
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        >
                            Sign in with GitHub
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}