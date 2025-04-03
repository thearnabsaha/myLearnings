import { WebSocketServer,WebSocket } from 'ws';

let allSockets:WebSocket[]=[];
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (socket) => {
    allSockets.push(socket)
    console.log('Connection established');
    socket.send('Server'+' is sending this message ');
    
    socket.on('message', (message) => {
        allSockets.forEach(e => {
            e.send("server : "+message.toString())
        });
    });
    socket.on('disconnect',()=>{
        allSockets=allSockets.filter((e)=>e!=socket)
    })
});

console.log('WebSocket server is running on ws://localhost:8080');