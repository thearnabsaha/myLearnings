import { useEffect, useRef, useState } from "react"
interface MessageType{
  msg:string,
  timestamps:string,
  from:"Server"|"You"
}
const useWebSocket = (url:string) => {
  const wsRef = useRef<WebSocket|null>(null)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0)
  const connectWebsocket=()=>{
    const socket = new WebSocket(url)
    wsRef.current=socket
    socket.onopen=()=>{
      console.log("socket opened")
      setReconnectionAttempts(0)
    }
    socket.onmessage=(msg)=>{
      const time=new Date().toLocaleString()
      setMessages(prev=>[...prev,{msg:msg.data,timestamps:time,from:"Server"}])
    }
    socket.onclose=()=>{
      console.log("socket closed")
      attemptReconnect()
    }
    socket.onerror=(error)=>{
      console.log("Websocket errors : ",error)
      attemptReconnect()
    }
  }
  const attemptReconnect=()=>{
    if(wsRef.current?.readyState===WebSocket.OPEN){
      return;
    }
    const delay =Math.min(1000*reconnectionAttempts*2,30000)
    setTimeout(() => {
      console.log("Attempting Reconnect...")
      connectWebsocket()
      setReconnectionAttempts(prev=>prev+1)
    }, delay);
  }
  useEffect(() => {
    connectWebsocket()
    return () => {
      wsRef.current?.close()
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