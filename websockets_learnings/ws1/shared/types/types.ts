interface Message {
    type:"chat"|"join"|"leave"|"ping"|"system",
    payload:any
}