import { useEffect, useRef, useState } from "react"

const useWebSocket = (url:string) => {
  const wsRef = useRef<WebSocket|null>(null)
  const [messages, setMessages] = useState<string>("")
  useEffect(() => {
    const socket = new WebSocket(url)
    wsRef.current=socket
    socket.onopen=()=>{
      console.log("socket opened")
    }
    socket.onmessage=(msg)=>{
      setMessages(msg.data)
    }
    socket.onclose=()=>{
      console.log("socket closed")
    }
    socket.onerror=(error)=>{
      console.log(error)
    }
    return () => {
      socket.close()
      wsRef.current = null;
    }
  }, [url])

  return {messages}
}
export default useWebSocket