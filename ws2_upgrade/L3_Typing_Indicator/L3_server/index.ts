import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (socket) => {
  socket.send('Connection established');
  try {
    socket.on("message",(msg)=>{
        const data=JSON.parse(msg.toString())
        if(data.type=="message"){
            wss.clients.forEach((client)=>{
                if(client.readyState==client.OPEN){
                    client.send(JSON.stringify({type:data.type,content:data.content}))
                }
            })
        }
        if(data.type=="typing"){
            wss.clients.forEach((client)=>{
                if(client.readyState==client.OPEN){
                    client.send(JSON.stringify({type:data.type,isTyping:data.isTyping}))
                }
            })
        }
    })
} catch (error) {
    console.log(error)
}
});

console.log('WebSocket server is running on ws://localhost:3001');