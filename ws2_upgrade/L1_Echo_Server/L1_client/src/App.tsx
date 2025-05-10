import { useState } from "react"
import { Input } from "./components/ui/input"
import useWebSocket from "./hooks/useWebSocket"
import { Button } from "./components/ui/button"

const App = () => {
  const { sendMessage, messages } = useWebSocket("ws://localhost:3001")
  const [inputValue, setInputValue] = useState("")
  const SendHandler = () => {
    sendMessage(inputValue)
    console.log(messages)
    setInputValue("")
  }
  return (
    <div>
      <Input value={inputValue} onChange={(e) => { setInputValue(e.target.value) }} />
      <Button onClick={SendHandler}>Send</Button>
      {
        messages.map((e) => {
          return (
            <div key={e.timestamps}>
              <h1>{e.from}</h1>
              <h1>{e.msg}</h1>
              <h1>{e.timestamps}</h1>
            </div>
          )
        })
      }
    </div>
  )
}

export default App