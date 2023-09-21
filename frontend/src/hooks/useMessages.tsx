import React, { useState } from "react";
import { SocketMessage } from "../models/SocketMessage";
import { AES, enc } from "crypto-js";
import { Socket } from "socket.io-client";

export default function useMessages() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SocketMessage[]>([]);

  function receiveMessage(newMessage: SocketMessage, decrypt: boolean): void {
    newMessage.body = decrypt
      ? decryptString(newMessage.body)
      : newMessage.body;

    setMessages((oldMessages) => [...oldMessages, newMessage]);
  }

  function decryptString(data: string): string {
    return AES.decrypt(data, import.meta.env.VITE_ENCRYPT_KEY).toString(
      enc.Utf8
    );
  }

  function handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
  }

  function handleFormSubmit(
    event: React.FormEvent<HTMLFormElement>,
    socket: Socket
  ) {
    event.preventDefault();
    socket.emit("message", message);
    setMessage("");
    receiveMessage(
      {
        body: message,
        id: "Me",
        type: "text",
      },
      false
    );
  }

  return {
    messages,
    receiveMessage,
    message,
    handleMessageChange,
    handleFormSubmit,
  };
}
