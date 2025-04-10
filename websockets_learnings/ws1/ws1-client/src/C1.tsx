import { useEffect, useRef, useState } from "react"

const C1 = () => {
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [ws, setWs] = useState<WebSocket|null>(null)
    const [msgs, setMsgs] = useState<{msg:string,timestamps:string, from:"You"|"Server"}[]>([])
    useEffect(() => {
        const socket= new WebSocket("ws://localhost:3001")
        socket.onopen=()=>{
            console.log("socket opened")
        }
        socket.onmessage=(msg)=>{
            console.log("msg : "+msg.data)
            const time= new Date().toLocaleString()
            setMsgs(prev=>[...prev,{msg:msg.data,timestamps:time,from:"Server"}])
        }
        socket.onclose=()=>{
            console.log("socket closed")
        }
        socket.onerror=(error)=>{
            console.log(error)
        }
        setWs(socket)
      return () => {
        socket.close()
      }
    }, [])
    
    const handleSend=()=>{
        if(ws?.readyState==WebSocket.OPEN){
            ws?.send(inputValue)
            setInputValue("")
            inputRef.current?.focus()
            const time = new Date().toLocaleString()
            setMsgs(prev=>[...prev,{msg:inputValue,timestamps:time,from:"You"}])
        }else{
            console.log("socket is closed")
            setInputValue("")
        }
    }
  return (
    <div>
        <h1>Arnab</h1>
        <input type="text" ref={inputRef} onChange={(e)=>setInputValue(e.target.value)} value={inputValue} className="border bg-pink-50"/>
        <button onClick={handleSend} className="border bg-blue-200 p-5 m-5" disabled={!inputValue}>Send</button>
        {
            msgs.map((e,index)=>{
                return(
                    <div className="mb-5" key={index}>
                        <li>{e.from}</li>
                        <li>{e.msg}</li>
                        <li>{e.timestamps}</li>
                    </div>
                )
            })
        }
    </div>
  )
}

export default C1