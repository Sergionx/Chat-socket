import { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  onJoin: (roomCode: string) => void;
  disabled: boolean;
}

export default function JoinButton({ onJoin, disabled }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [roomCode, setRoomCode] = useState("");

  function openModal() {
    modalRef.current?.showModal();

    modalRef.current?.addEventListener("click", (event) => {
      if (event.target === modalRef.current) closeModal();
    });
  }

  function closeModal() {
    modalRef.current?.close();
    setRoomCode("");
  }

  function handleJoin() {
    onJoin(roomCode);
    closeModal();
  }

  return (
    <>
      <button
        disabled={disabled}
        className="px-6 py-3.5 bg-primary-400 basis-1/2 rounded-lg
            font-bold text-xl"
        onClick={openModal}
      >
        Join
      </button>

      <dialog
        ref={modalRef}
        onClose={closeModal}
        className="backdrop:bg-black/50 backdrop:backdrop-blur-sm
        rounded-lg shadow-lg p-0 relative"
      >
        <main
          className="flex flex-col min-w-[300px] max-w-[600px] px-4 pb-4 py-8
          border border-gray-400 "
        >
          <button
            className="absolute right-3 top-3
            hover:bg-gray-200 p-2 rounded-md"
            onClick={closeModal}
          >
            <AiOutlineClose size={16} />
          </button>

{/* TODO - Añadir validación con react-forms */}
          <label htmlFor="roomCode" className="text-lg font-semibold mb-2">
            Room Code
          </label>
          <input
            type="text"
            id="roomCode"
            className="border border-gray-400 rounded-lg p-2 mb-6 outline-none
            focus:ring-2 focus:ring-primary-400 bg-gray-100"
            value={roomCode}
            onChange={(event) => setRoomCode(event.target.value)}
          />

          <footer className="flex flex-row-reverse gap-4 pt-4 border-t border-gray-500">
            <button
              className="px-4 py-2 rounded-md bg-primary-400 text-white
            hover:bg-primary-500 hover:ring-2 hover:ring-primary-400
            active:bg-primary-700 active:ring-2 active:ring-primary-700 active:scale-95"
              onClick={handleJoin}
            >
              Join Room
            </button>
            <button
              className="px-4 py-2 border-2 rounded-md border-gray-200
            hover:border-gray-400 hover:bg-gray-50 hover:text-primary-700
            active:border-primary-700 active:scale-95 active:text-primary-700"
              onClick={closeModal}
            >
              Cancel
            </button>
          </footer>
        </main>
      </dialog>
    </>
  );
}
