import { useState } from "react";
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "../utils/encryption";
import JoinModal from "../components/Join-Button";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [joiningRoom, setJoiningRoom] = useState(false);
  const navigate = useNavigate();

  async function handleCreateChat(): Promise<void> {
    // TODO - Prohibir que el usuario cree una sala sin nombre
    const password = "hola123";
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

  function onJoin(roomCode: string) {
    if (!userName) console.log("Username is required");
    if (!roomCode) console.log("Room code is required");
    navigate(`/${roomCode}`, { state: { userName } });
  }

  return (
    <main
      className={`flex relative flex-col backdrop-blur-md bg-secondary-200/50 p-8 rounded-md
      min-h-[80vh] w-[80vw] max-w-[600px] max-h-[600px] overflow-y-auto
      ${joiningRoom ? "pointer-events-none " : "pointer-events-auto"}}`}
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
        <JoinModal disabled={joiningRoom} onJoin={onJoin} />

        <button
          onClick={handleCreateChat}
          disabled={joiningRoom || !userName}
          // disabled={true}
          className="px-6 py-3.5 border-2 border-primary-400 basis-1/2 rounded-lg
            font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Chat
        </button>
      </footer>

      <span
        className="text-red-600 text-lg text-center mt-2"
        hidden={!!userName}
      >
        You must enter a username to create a chat
      </span>

      {/* TODO - loading en su respectivo componente */}
      <div
        role="status"
        className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
        hidden={!joiningRoom}
      >
        <svg
          aria-hidden="true"
          className="w-16 h-16 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-500"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </main>
  );
}
