import { WebSocketServer } from "ws";

const wss=new WebSocketServer({port:8080})
wss.on("connection",(socket)=>{
    console.log("connection stabished");
    socket.on("message",(e)=>{
        console.log(e.toString());
        if(e.toString()=="ping"){
            socket.send("pong")
        }
    })
})
