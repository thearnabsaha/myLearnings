import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (socket) => {
  console.log('Connection established');
  try {
    const clock=setInterval(() => {
      const time=new Date()
      socket.send(time.toLocaleTimeString())
    }, 1000);
    socket.on("close",()=>{
      clearInterval(clock)
    })
  } catch (error) {
    
  }
});

console.log('WebSocket server is running on ws://localhost:3001');