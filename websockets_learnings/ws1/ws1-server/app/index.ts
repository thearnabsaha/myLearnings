import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3001 });
const clients= new Map<WebSocket,{username:string,roomId:string}>()
const rooms= new Map<string,Set<WebSocket>>()
wss.on('connection', (socket) => {
  try {
    socket.on('message', (message) => {
      const data=JSON.parse(message.toString())
      switch (data.type) {
        case "join":{
          const client=clients.get(socket)
          if(client){
            socket.send("You Already joined that Room!")
            return;
          }
          const {username,roomId}=data.payload
          clients.set(socket,{username,roomId})
          if(!rooms.has(roomId)){
            rooms.set(roomId, new Set())
          }
          rooms.get(roomId)!.add(socket)
          rooms.get(roomId)!.forEach((e)=>{
            if(e!==socket){
              e.send(username+" Joined The Room : "+roomId)
            }
          })
          break;
        }
        case "chat":{
          const client=clients.get(socket)
          const {message}=data.payload
          if(message.trim()==""){
            socket.send("You can't left message empty")
          }
          if(!client){
            socket.send("You haven't join the room yet")
            return;
          }
          rooms.get(client.roomId)?.forEach((e)=>{
            if(e!==socket){
              e.send(client.username+" : "+message)
            }
          })
          break;
        }
        case "leave":{
          
          break;
        }
        default:
          socket.send("Wrong type of Message was sent!")
          console.log("Wrong type of Message was sent!")
          break;
      }
    });

    socket.on('close', () => {

    });
  } catch (error) {
    console.log(error);
  }
});

console.log('WebSocket server is running on ws://localhost:3001');