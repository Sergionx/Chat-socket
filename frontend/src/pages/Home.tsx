import { useState } from "react";
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  async function handleCreateChat(): Promise<void> {
    // TODO - Prohibir que el usuario cree una sala sin nombre
    if (!userName) console.log("Username is required");

    try {
      const response = await axiosClient.post("/chat-room", { userName });

      const { roomCode } = await response.data;

      navigate(`/${roomCode}`, { state: { userName } });
    } catch (error) {}
  }

  return (
    <main
      className="flex flex-col backdrop-blur-md bg-secondary-200/50 p-8 rounded-md
      min-h-[80vh] w-[80vw] max-w-[600px] max-h-[600px] overflow-y-auto "
    >
      <h1 className="text-4xl font-bold mb-6">Private Chat</h1>

      <h2 className="text-2xl font-bold mb-6">
        Create a Room or Join an Existing One
      </h2>

      <section>
        <label htmlFor="username" className="text-xl font-bold mb-2">
          Username
        </label>

        <input
          id="username"
          className="rounded-full p-4 text-xl
          placeholder-primary-300  w-full
          outline-none group-focus:ring-2 group-focus:ring-primary-400"
          placeholder="Enter your username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </section>

      <footer className="flex gap-4 mt-4">
        <button
          className="p-4 bg-primary-400 basis-1/2 rounded-lg
            font-bold text-xl"
        >
          Join
        </button>

        <button
          onClick={handleCreateChat}
          className="p-4 border-2 border-primary-400 basis-1/2 rounded-lg
            font-bold text-xl"
        >
          Create Chat
        </button>
      </footer>
    </main>
  );
}
