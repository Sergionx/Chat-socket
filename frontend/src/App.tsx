import { AES, enc } from "crypto-js";
import { FormEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Blobs from "./components/Blobs";

import { AiOutlineFileImage, AiOutlineSend } from "react-icons/ai";
import { SocketMessage } from "./models/SocketMessage";
import Messages from "./components/Messages";

const socket = io("/");

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
        type: "text",
      },
      false
    );
  }

  useEffect(() => {
    socket.on("message", (message) => receiveMessage(message, true));

    return () => turnOffSoccket();
  }, []);

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

  function turnOffSoccket() {
    socket.off("message");
  }

  function handleFileChange(files: FileList | null) {
    if (!files) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result?.toString();
      if (base64String) {
        receiveMessage(
          {
            body: base64String,
            id: "Me",
            type: "image",
          },
          false
        );
        socket.emit("image", base64String);
      }
    };

    reader.readAsDataURL(file);
  }

  // TODO - Add images
  return (
    <>
      <div
        className="bg-primary-400/40 min-h-screen  
          grid place-items-center"
      >
        <Blobs />
        <main
          className="flex flex-col backdrop-blur-md bg-secondary-200/50 p-8 rounded-md
          min-h-[80vh] w-[80vw] max-w-[600px] max-h-[600px] overflow-y-auto 
        "
        >
          <h1 className="text-4xl font-bold mb-6">Private Chat</h1>

          <Messages messages={messages} />

          <form
            onSubmit={handleSubmit}
            className="flex items-center  mt-auto bg-white p-2 rounded-md focus-within:ring-2
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
            <input
              type="file"
              id="file"
              hidden={true}
              accept="image/*"
              onChange={(event) => handleFileChange(event.target.files)}
            />

            <label htmlFor="file" className="ml-auto cursor-pointer">
              <AiOutlineFileImage
                size={28}
                className="text-primary-400 hover:text-primary-500"
              />
            </label>

            <button className="ml-2 bg-secondary-100 rounded-full p-2" type="submit">
              <AiOutlineSend
                size={24}
                className="text-primary-400 hover:text-primary-500"
              />
            </button>
          </form>
        </main>
      </div>
    </>
  );
}
