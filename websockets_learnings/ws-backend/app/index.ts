import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (socket) => {
    console.log('Connection established');
    socket.send('Server is sending this message: saying everything is alright');
    
    socket.on('message', (e) => {
        console.log(e.toString());
    });
});

console.log('WebSocket server is running on ws://localhost:8080');