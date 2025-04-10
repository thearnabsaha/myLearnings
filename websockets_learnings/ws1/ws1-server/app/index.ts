// import { WebSocketServer, WebSocket } from 'ws';

// let allSockets: WebSocket[] = [];
// const wss = new WebSocketServer({ port: 8080 });

// wss.on('connection', (socket) => {
//   allSockets.push(socket);
//   console.log('Connection established');

//     socket.on("message",(message)=>{
//         try {
//             const data=JSON.parse(message.toString())
//             allSockets.forEach(e => {
//                 e.send(data.username+" : "+data.message)
//             });
//         } catch (error) {
//             console.log(error)
//         }
//     })

//   socket.on('close', () => {
//     allSockets = allSockets.filter((e) => e !== socket);
//   });
// });

// console.log('WebSocket server is running on ws://localhost:8080');

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (socket) => {
  console.log('Connection established');
  socket.on('message', (message) => {
    socket.send(message.toString())
  });

  socket.on("close", () => {
    console.log("i got disconnected")
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
