import { useState } from "react"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import useWebSocket from "./hooks/useWebSocket"

const App = () => {
    const {sendMessage,messages} =useWebSocket("ws://localhost:3001")
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const sendHandler=()=>{
        sendMessage(inputValue)
        setInputValue("")
    }
  return (
    <div>
        <Input value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
        <Button onClick={sendHandler}>Send</Button>
        {
            messages.map((e)=>{
                return(
                    <h1 key={e.timestamps}>{e.msg}</h1>
                )
            })
        }
    </div>
  )
}

export default App