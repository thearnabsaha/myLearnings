import { useRef, useState } from "react"
import useWebSocket from "./hooks/useWebSocket"

const C2 = () => {
    const {messages,sendMessage}=useWebSocket("ws://localhost:3001")
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef<HTMLInputElement|null>(null)
    const handleSubmit=()=>{
        sendMessage(inputValue)
        setInputValue("")
        inputRef.current?.focus()
    }
  return (
    <div>
        <input type="text" ref={inputRef} onChange={(e)=>setInputValue(e.target.value)} value={inputValue} className="border bg-amber-300 mt-5" onKeyDown={(e)=>{e.key==="Enter"&&handleSubmit()}}/>
        <button className="border bg-amber-700 m-3 p-3" onClick={handleSubmit} disabled={!inputValue}>Submit</button>
        {
            messages.map((e,index)=>{
                return(
                    <div key={index} className="m-5">
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

export default C2