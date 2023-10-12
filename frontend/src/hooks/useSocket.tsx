import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { SocketMessage } from "../models/SocketMessage";
import { hashPassword } from "../utils/encryption";

interface Props {
  receiveMessage(newMessage: SocketMessage, decrypt: boolean): void;
  password: string;
  onSocketError: (error: { message: string }) => void;
}

export default function useSocket({
  receiveMessage,
  password,
  onSocketError,
}: Props) {
  const { roomCode } = useParams<{ roomCode: string }>();

  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    try {
      if (socketConnected) return;

      socketRef.current = io("/", {
        auth: {
          roomCode,
          roomPassword: password ? hashPassword(password) : "",
        },
      });

      socketRef.current.on("message", (message) =>
        receiveMessage(message, true)
      );

      socketRef.current.on("connect", () => setSocketConnected(true));
      socketRef.current.on("disconnect", () => setSocketConnected(false));

      socketRef.current.on("error", onSocketError);
      return () => turnOffSoccket();
    } catch (error) {
      console.log(error);
      setSocketConnected(false);
    }
  }, []);

  function turnOffSoccket() {
    socketRef.current?.disconnect();
  }

  return {
    socket: socketRef.current,

    roomCode,
  };
}
