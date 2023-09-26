import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { SocketMessage } from "../models/SocketMessage";

interface Props {
  receiveMessage(newMessage: SocketMessage, decrypt: boolean): void;
}

export default function useSocket({ receiveMessage }: Props) {
  const socketRef = useRef<Socket>();

  const { roomCode } = useParams<{ roomCode: string }>();

  useEffect(() => {
    socketRef.current = io("/", {
      auth: {
        roomCode,
      },
    });

    socketRef.current.on("message", (message) => receiveMessage(message, true));

    return () => turnOffSoccket();
  }, []);

  function turnOffSoccket() {
    socketRef.current?.disconnect();
  }

  return {
    socket: socketRef.current,
    roomCode,
  };
}
