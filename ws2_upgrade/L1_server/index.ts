import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (socket) => {
  console.log('Connection established');
  socket.send('Server is sending this message');
try {
    socket.send("msg from server!")
    socket.on("message",(msg)=>{
        const data=msg.toString()
        socket.send("you typed : "+data)
    })
} catch (error) {
    console.log(error)
}
});

console.log('WebSocket server is running on ws://localhost:3001');
