import { WebSocketServer } from "ws";

const wss=new WebSocketServer({port:8080})
wss.on("connection",(socket)=>{
    console.log("connection stabished");
    setInterval(() => {
        socket.send("solana price right now : "+Math.random())
    }, 500);
    socket.on("message",(e)=>{
        console.log(e.toString());
    })
})