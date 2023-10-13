import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { SocketMessage } from "../models/SocketMessage";
import { hashPassword } from "../utils/encryption";
import { SocketError } from "../utils/errors";

interface Props {
  password: string;
  userName: string;
  receiveMessage(newMessage: SocketMessage, decrypt: boolean): void;
  onSocketError: (error: { messages: SocketError[] }) => void;
}

export default function useSocket({
  password,
  userName,
  receiveMessage,
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
          userName,
        },
      });

      activateListeners(socketRef.current);

      return () => turnOffSoccket();
    } catch (error) {
      console.log(error);
      setSocketConnected(false);
    }
  }, []);

  function turnOffSoccket() {
    socketRef.current?.disconnect();
  }

  function activateListeners(socket: Socket, replaceOldSocket = false) {
    if (replaceOldSocket) socketRef.current = socket;

    socket.on("message", (message) => receiveMessage(message, true));

    socket.on("connect", () => setSocketConnected(true));
    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("error", onSocketError);
  }

  return {
    socket: socketRef.current,
    activateListeners,
    roomCode,
  };
}
