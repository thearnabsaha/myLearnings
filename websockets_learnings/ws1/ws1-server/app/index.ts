import { WebSocketServer, WebSocket } from 'ws';

let allSockets: WebSocket[] = [];
const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (socket) => {
  allSockets.push(socket);
  console.log('Connection established');
  socket.send('Server is sending this message');

  socket.on('message', (message) => {
    allSockets.forEach((e) => {
      if(e.readyState===WebSocket.OPEN){
        e.send('server : ' + message.toString());
      }
    });
  });

  socket.on('close', () => {
    allSockets = allSockets.filter((e) => e !== socket);
  });
});

console.log('WebSocket server is running on ws://localhost:3001');