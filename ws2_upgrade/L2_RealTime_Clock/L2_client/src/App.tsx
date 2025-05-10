import useWebSocket from "./hooks/useWebSocket"

const App = () => {
  const {messages}=useWebSocket("ws://localhost:3001")
  return (
    <div>
      <h1>{messages}</h1>
    </div>
  )
}

export default App