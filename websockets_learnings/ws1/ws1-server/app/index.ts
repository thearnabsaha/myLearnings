import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3001 });
const clients=new Map<WebSocket,string>()
wss.on('connection', (socket) => {
  console.log('Connection established');

  socket.on('message', (message) => {
    const data=JSON.parse(message.toString())
    if(data.type=="join"){
      const username=data.payload.username;
      if(!username) return;
      clients.set(socket,username)
      clients.forEach((username,keySocket)=>{
        if(keySocket.readyState===WebSocket.OPEN){
          keySocket.send( username+" Joined Successfully")
        }
      })
    }
    if(data.type=="chat"){
      const username=data.payload.username;
      if(!username) return;
      clients.forEach((username,keySocket)=>{
        if(keySocket.readyState===WebSocket.OPEN){
          keySocket.send( username+" left the group. ")
        }
      })
    }
    if(data.type=="leave"){
      const username=data.payload.username;
      if(!username) return;
      clients.delete(socket)
      clients.forEach((username,keySocket)=>{
        if(keySocket.readyState===WebSocket.OPEN){
          keySocket.send( username+" : "+data.payload.message)
        }
      })
    }
  });

  socket.on('close', () => {
    clients.delete(socket)
  });
});

console.log('WebSocket server is running on ws://localhost:3001');