import { WebSocketServer } from "ws";

const wss=new WebSocketServer({port:8080})
wss.on("connection",(socket)=>{
    console.log("connection stabished");
    socket.send("hello! i am arnab saha")
    socket.on("message",(e)=>{
        console.log(e.toString());
    })
})