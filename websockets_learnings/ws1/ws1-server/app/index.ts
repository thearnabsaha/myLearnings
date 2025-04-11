import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3001 });
const clients = new Map<WebSocket, string>()
wss.on('connection', (socket) => {
  console.log('Connection established');
  socket.send('Server is sending this message');
  try {
    socket.on('message', (message) => {
      const data=JSON.parse(message.toString())
      const username=data.payload.username;
      switch (data.type) {
        case "join":
          if(clients.get(socket)){
            socket.send("You are already in the room")
            return;
          }
          clients.set(socket,username)
          clients.forEach((_user,KeySocket)=>{
            if(KeySocket!==socket){
              KeySocket.send(data.payload.username+" joined the room")
            }else{
              KeySocket.send("You Joined")
            }
          })
          break;
        case "chat":
          if(!clients.get(socket)){
            socket.send("You need to join first")
            return;
          }
          clients.forEach((_user,keySocket)=>{
            if(keySocket!==socket){
              keySocket.send(clients.get(socket)+" : "+data.payload.message)
            }
          })
          break;
        case "leave":
          const socketName=clients.get(socket);
          if(!socketName){
            socket.send("You Need to Join Room First")
            return;
          }
          clients.delete(socket)
          socket.send("You Left")
          clients.forEach((_user,keySocket)=>{
            if(keySocket!==socket){
              keySocket.send(socketName+" Left")
            }
          })
          console.log("leave");
          break;
        default:
          socket.send("wrong type of messages")
          console.log("wrong type of messages")
          break;
      }
    });

    socket.on('close', () => {
      const socketName=clients.get(socket)
      clients.delete(socket)
      clients.forEach((_user,keySocket)=>{
        keySocket.send(socketName+" Got Disconnected!")
      })
    });
  } catch (error) {
    console.log(error)
  }
});

console.log('WebSocket server is running on ws://localhost:3001');