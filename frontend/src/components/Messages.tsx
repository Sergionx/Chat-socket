import { useEffect } from "react";
import { SocketMessage } from "../models/SocketMessage";

interface Props {
  messages: SocketMessage[];
  handleImageClick(src: string, caption?: string): void;
}

export default function Messages({ messages, handleImageClick }: Props) {
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <>
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
            {message.text}

            {message.image && (
              <img
                src={message.image}
                className="max-w-full max-h-full cursor-pointer mt-2 rounded-sm"
                onClick={() =>
                  handleImageClick(message.image!, "message.caption")
                }
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
