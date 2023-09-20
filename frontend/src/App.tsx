import { AES, enc } from "crypto-js";
import { FormEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";

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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="bg-slate-300"
          placeholder="Write your message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />

        <button>Send</button>
      </form>

      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.id}: {message.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
