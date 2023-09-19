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
    receiveMessage({
      body: message,
      id: 'Me',
    });
  }

  useEffect(() => {
    socket.on("message", receiveMessage);

    return () => turnOffSoccket();
  }, []);

  function receiveMessage(newMessage: SocketMessage): void {
    setMessages((oldMessages) => [...oldMessages, newMessage]);
  }

  function turnOffSoccket() {
    socket.off("message");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
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
