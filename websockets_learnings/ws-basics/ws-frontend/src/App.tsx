import { useEffect, useState } from "react"

const App = () => {
  const [inputValue, setInputValue] = useState('')
  const [socket, setsocket] = useState<WebSocket|null>(null)
  useEffect(() => {
    const newsocket= new WebSocket("ws://localhost:8080")
    setsocket(newsocket)
    newsocket.onopen=()=>{
      console.log("connection established");
    }
    newsocket.onmessage=(e)=>{
      console.log("msg from server : "+e.data);
    }
  }, [])
  const handleSend=()=>{
    socket?.send(inputValue)
    setInputValue("")
  }
  const handleSendkey=(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key=="Enter"){
      e.preventDefault()
      handleSend()
    }
  }
  return (
    <div>
      <input type="text" value={inputValue} onChange={(e)=>setInputValue(e.target.value)} placeholder="send msg to server" onKeyDown={handleSendkey}/>
      <button onClick={handleSend} disabled={!inputValue}>send</button>
    </div>
  )
}
export default App