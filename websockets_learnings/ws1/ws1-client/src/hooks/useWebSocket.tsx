import { useEffect, useRef, useState } from "react"
interface MessageType{
  msg:string,
  timestamps:string,
  from:"Server"|"You"
}
const useWebSocket = (url:string) => {
  const wsRef = useRef<WebSocket|null>(null)
  const [messages, setMessages] = useState<MessageType[]>([])
  useEffect(() => {
    const socket = new WebSocket(url)
    wsRef.current=socket
    socket.onopen=()=>{
      console.log("socket opened")
    }
    socket.onmessage=(msg)=>{
      const time=new Date().toLocaleString()
      setMessages(prev=>[...prev,{msg:msg.data,timestamps:time,from:"Server"}])
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
  const sendMessage=(msg:string)=>{
    if(msg.trim()===""){
      return;
    }
    const socket=wsRef.current
    if(socket?.readyState==WebSocket.OPEN){
      socket?.send(msg)
      const time=new Date().toLocaleString()
      setMessages(prev=>[...prev,{msg:msg,timestamps:time,from:"You"}])
    }else{
      console.warn("socket is closed wait until its open")
    }
  }
  return {sendMessage,messages}
}
export default useWebSocket