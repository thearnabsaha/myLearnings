import { useEffect, useRef, useState } from "react";

export interface MessageType {
  from: string;
  text: string;
  timestamp: string;
  system?: boolean;
}

export const useWebSocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [connected, setConnected] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const raw = event.data;

      try {
        const parsed = JSON.parse(raw);
        if (parsed.type === "system") {
          const { message, username } = parsed.payload;
          const msgObj: MessageType = {
            from: username,
            text: message,
            timestamp: new Date().toLocaleTimeString(),
            system: true,
          };
          setMessages((prev) => [...prev, msgObj]);
        } else {
          const msgObj: MessageType = {
            from: "Server",
            text: raw,
            timestamp: new Date().toLocaleTimeString(),
            system: true,
          };
          setMessages((prev) => [...prev, msgObj]);
        }
      } catch {
        const msgObj: MessageType = {
          from: "Broadcast",
          text: raw,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, msgObj]);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      setInRoom(false);
    };

    return () => socket.close();
  }, [url]);

  const sendMessage = (text: string) => {
    if (socketRef.current && inRoom && username) {
      socketRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: { username, message: text },
        })
      );
    }
  };

  const joinRoom = (uname: string, r: string) => {
    if (socketRef.current) {
      setUsername(uname);
      setRoom(r);
      socketRef.current.send(
        JSON.stringify({
          type: "join",
          payload: { username: uname, room: r },
        })
      );
      setInRoom(true);
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "leave", payload: {} }));
      setInRoom(false);
    }
  };

  return {
    connected,
    inRoom,
    messages,
    sendMessage,
    joinRoom,
    leaveRoom,
  };
};
