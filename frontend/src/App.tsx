import { AES, enc } from "crypto-js";
import { FormEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Blobs from "./components/Blobs";

import { AiOutlineFileImage, AiOutlineSend } from "react-icons/ai";

const socket = io("/");

interface SocketMessage {
  body: string;
  id: string;
}

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SocketMessage[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    socket.emit("message", message);
    setMessage("");
    receiveMessage(
      {
        body: message,
        id: "Me",
      },
      false
    );
  }

  useEffect(() => {
    socket.on("message", (message) => receiveMessage(message, true));

    return () => turnOffSoccket();
  }, []);

  function receiveMessage(newMessage: SocketMessage, decrypt: boolean): void {
    console.log(newMessage.id, decrypt);

    newMessage.body = decrypt
      ? decryptMessage(newMessage.body)
      : newMessage.body;

    setMessages((oldMessages) => [...oldMessages, newMessage]);
  }

  function decryptMessage(message: string): string {
    return AES.decrypt(message, import.meta.env.VITE_ENCRYPT_KEY).toString(
      enc.Utf8
    );
  }

  function turnOffSoccket() {
    socket.off("message");
  }

  // TODO - Add images
  return (
    <>
      <main
        className="bg-primary-400/40 min-h-screen relative 
          grid place-items-center"
      >
        <Blobs />
        <div
          className="flex flex-col backdrop-blur-md bg-secondary-200/50 p-8 rounded-md
          h-[80vh] w-[80vw] max-w-[600px] max-h-[600px]
        "
        >
          <h1 className="text-4xl font-bold mb-6">Private Chat</h1>

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
                {message.body}
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleSubmit}
            className="flex  mt-auto bg-white p-2 rounded-md focus-within:ring-2
            ring-offset-2 ring-secondary-600 "
          >
            {/* TODO - Handle resize */}
            <input
              placeholder="Write your message..."
              className="placeholder-primary-300 resize-none w-full
                outline-none group-focus:ring-2 group-focus:ring-primary-400
              "
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />

            <button type="button" className="ml-auto">
              <AiOutlineFileImage
                size={28}
                className="text-primary-400 hover:text-primary-500"
              />
            </button>

            <button className="bg-secondary-100 rounded-full p-2" type="submit">
              <AiOutlineSend
                size={24}
                className="text-primary-400 hover:text-primary-500"
              />
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
