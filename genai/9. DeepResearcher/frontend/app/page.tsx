"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ModeToggle } from "@/components/ModeToggle";
import { ArrowUp, Check, Copy, MessageCircleDashed } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const formSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .refine((val) => val.replace(/\s/g, "").length > 0, {
      message: "Message cannot be only spaces or newlines",
    }),
});
type Message = {
  id: string;
  input: string;
  answer: string;
};
const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setthreadId] = useState("");
  const [toggle, setToggle] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setthreadId(
      (Date.now().toString(36) +
        Math.random().toString(36).substring(2, 8)) as string,
    );
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setMessages([
      ...messages,
      {
        id: crypto.randomUUID(),
        input: String(values.message),
        answer: "Loading...",
      },
    ]);
    axios
      .post(`${BACKEND_URL}/chat`, {
        inputMessage: values.message as string,
        threadId,
      })
      .then(function (response) {
        setMessages([
          ...messages,
          {
            id: crypto.randomUUID(),
            input: String(values.message),
            answer: String(response.data),
          },
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
    form.reset();
  }
  return (
    <div className="mx-auto w-[90vw] lg:w-[50vw]">
      <div className="flex items-center justify-between pt-2 fixed w-screen left-0 px-10 bg-background">
        <div className="flex items-center">
          <MessageCircleDashed />
          <h1 className="text-2xl ml-2">Prompt Enhancer</h1>
        </div>
        <div className=" flex justify-center items-center">
          <ModeToggle />
        </div>
      </div>
      <div className="flex flex-col flex-wrap mb-100 pt-10">
        {messages.map((e) => {
          return (
            <div key={e.id} className="flex flex-col flex-wrap ">
              <div ref={messagesEndRef} />
              <p className="font-light py-1.5 px-3 rounded-xl bg-accent my-5 max-w-96 self-end whitespace-pre-wrap break-all">
                {e.input}
              </p>
              {e.answer == "Loading..." ? (
                <p className="font-light py-1.5 px-3 rounded-xl my-5 self-start whitespace-pre-wrap break-all animate-pulse">
                  {e.answer}
                </p>
              ) : (
                // <p className="font-light py-1.5 px-3 rounded-xl my-5 self-start whitespace-pre-wrap break-all">
                //   {e.answer}
                // </p>
                <div className="prose prose-slate max-w-none my-5 self-start font-light">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      blockquote({ children, ...props }) {
                        const getTextContent = (
                          node: React.ReactNode,
                        ): string => {
                          if (typeof node === "string") return node;
                          if (typeof node === "number") return String(node);
                          if (Array.isArray(node))
                            return node.map(getTextContent).join("");
                          if (React.isValidElement(node)) {
                            return getTextContent(
                              (node.props as { children?: React.ReactNode })
                                .children,
                            );
                          }
                          return "";
                        };
                        const copyHandler = () => {
                          const textcontent = getTextContent(children);
                          setToggle(true);
                          navigator.clipboard.writeText(textcontent);
                          setTimeout(() => {
                            setToggle(false);
                          }, 800);
                        };
                        return (
                          <div className="relative group">
                            <code
                              className="block bg-black text-white p-4 rounded-lg overflow-x-auto font-mono text-sm w-full"
                              {...props}
                            >
                              {children}
                            </code>
                            <div
                              onClick={copyHandler}
                              className=" flex flex-col"
                            >
                              {toggle ? (
                                <Button className="text-white bg-[#424242] mt-2 self-end cursor-pointer">
                                  <Check />
                                </Button>
                              ) : (
                                <Button className="mt-2 self-end cursor-pointer text-white bg-[#424242]">
                                  <Copy />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      },
                      code({
                        className,
                        children,
                        ...props
                      }: {
                        className?: string;
                        children?: React.ReactNode;
                      }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const inline = !match; // If no language class, it's inline code

                        return inline ? (
                          <code
                            className="bg-[#424242] px-1.5 py-0.5 rounded text-sm font-mono text-white"
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <code
                            className="block bg-[#222] text-white p-4 rounded-lg overflow-x-auto font-mono text-sm my-4 w-full"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      strong({ children, ...props }) {
                        return (
                          <strong className=" font-semibold" {...props}>
                            {children}
                          </strong>
                        );
                      },
                      p({ children, ...props }) {
                        return (
                          <div className="my-5" {...props}>
                            {children}
                          </div>
                        );
                      },
                      ul({ children, ...props }) {
                        return (
                          <ul className="list-disc pl-6 space-y-2" {...props}>
                            {children}
                          </ul>
                        );
                      },
                      hr({ children, ...props }) {
                        return (
                          <hr
                            className="my-4 border-t border-[#424242]"
                            {...props}
                          />
                        );
                      },
                      ol({ children, ...props }) {
                        return (
                          <ol
                            className="list-decimal pl-6 space-y-2"
                            {...props}
                          >
                            {children}
                          </ol>
                        );
                      },
                    }}
                  >
                    {e.answer}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="fixed bottom-0 py-10 left-0 w-screen flex justify-center bg-background">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[90vw] lg:w-[40vw] flex rounded-2xl bg-accent items-center p-1"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      className="max-h-60 resize-none border-none mr-2"
                      placeholder="Ask anything"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="cursor-pointer rounded-4xl h-8 w-8 mr-2"
              type="submit"
            >
              <ArrowUp />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
