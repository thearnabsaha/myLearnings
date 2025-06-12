import { useState } from "react";
import { useWebSocket } from "./hooks/useWebSocket";

const ChatRoom = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [input, setInput] = useState("");

  const {
    connected,
    inRoom,
    messages,
    sendMessage,
    joinRoom,
    leaveRoom,
  } = useWebSocket("ws://localhost:3001");

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">WebSocket Chat</h1>

      {!inRoom && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Enter Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={() => joinRoom(username, room)}
            disabled={!username || !room || !connected}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Join Room
          </button>
        </div>
      )}

      {inRoom && (
        <>
          <div className="border p-2 h-64 overflow-y-scroll rounded bg-gray-100">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-2">
                <span className="font-semibold">{msg.from}</span>:{" "}
                <span>{msg.text}</span>{" "}
                <span className="text-xs text-gray-500">({msg.timestamp})</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="Type your message"
            />
            <button
              onClick={() => {
                sendMessage(input);
                setInput("");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
            <button
              onClick={leaveRoom}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Leave
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatRoom;
