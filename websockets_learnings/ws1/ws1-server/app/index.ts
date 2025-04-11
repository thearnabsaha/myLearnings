import { WebSocketServer, WebSocket } from 'ws';
import { broadcast, handleChat, handleJoin, handleLeave, handlePing, handleSystem } from './helper';

const wss = new WebSocketServer({ port: 3001 });
const clients=new Map<WebSocket,string>()
wss.on('connection', (socket) => {
  console.log('Connection established');
  socket.on('message', (message) => {
    const data=JSON.parse(message.toString())
    switch (data.type) {
      case "join":
        handleJoin(data)
        console.log("join");
        break;
      case "chat":
        handleChat(data)
        console.log("chat");
        break;
      case "leave":
        handleLeave(data)
        console.log("leave");
        break;
      case "ping":
        handlePing(data)
        console.log("ping");
        break;
        case "system":
        handleSystem(data)
        console.log("system");
        break;
      default:
        socket.send("wrong type of message")
        console.log("worng type of message")
        break;
    }
  });
  socket.on('close', () => {
    clients.delete(socket)
  });
});

console.log('WebSocket server is running on ws://localhost:3001');