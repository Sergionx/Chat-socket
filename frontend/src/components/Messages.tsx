import React, { useEffect } from "react";
import { SocketMessage } from "../models/SocketMessage";

interface Props {
  messages: SocketMessage[];
}
// TODO - Zoom en la imagen
export default function Messages({ messages }: Props) {
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <ul className="flex flex-col gap-2 mb-6">
      {messages.map((message, index) => (
        <li
          key={index}
          className={`p-2 rounded-lg
                ${
                  message.id === "Me"
                    ? "bg-primary-400/90 rounded-tr-none"
                    : "bg-primary-300/90 rounded-tl-none"
                }`}
        >
          {message.type === "text" ? message.body : <img src={message.body} />}
        </li>
      ))}
    </ul>
  );
}
