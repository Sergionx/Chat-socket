import { useState } from "react";
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "../utils/encryption";
import JoinButton from "../components/Join-Button";
import CreateButton from "../components/Create-Button";
import Loading from "../components/Loading";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [joiningRoom, setJoiningRoom] = useState(false);
  const navigate = useNavigate();

  async function handleCreateChat(password: string): Promise<void> {
    if (!userName) console.log("Username is required");

    try {
      setJoiningRoom(true);
      const response = await axiosClient.post("/chat-room", {
        userName,
        isPrivate: false,
        password: hashPassword(password),
      });

      const { roomCode } = await response.data;

      console.log(roomCode);
      navigate(`/${roomCode}`, { state: { userName } });
      setJoiningRoom(false);
    } catch (error) {}
  }

  function onJoin(roomCode: string, password: string) {
    if (!userName) console.log("Username is required");
    if (!roomCode) console.log("Room code is required");
    navigate(`/${roomCode}`, { state: { userName } });
  }

  return (
    <>
      <main
        className={`flex relative flex-col backdrop-blur-md bg-secondary-200/50 p-8 rounded-md
      min-h-[80vh] w-[80vw] max-w-[600px] max-h-[600px] overflow-y-auto
      ${joiningRoom ? "pointer-events-none" : ""}}`}
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
          <JoinButton disabled={joiningRoom} onJoin={onJoin} />

          <CreateButton
            disabled={joiningRoom || !userName}
            onCreate={handleCreateChat}
          />
        </footer>

        <span
          className="text-red-600 text-lg text-center mt-2"
          hidden={!!userName}
        >
          You must enter a username to create a chat
        </span>
      </main>
      <Loading loading={joiningRoom} />
    </>
  );
}
