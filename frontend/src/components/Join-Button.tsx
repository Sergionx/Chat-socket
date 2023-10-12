import { useRef, useState } from "react";
import PasswordInput from "./inputs/Password-Input";
import Modal from "./Modal";

interface Props {
  onJoin: (roomCode: string, password: string) => void;
  disabled: boolean;
}

export default function JoinButton({ onJoin, disabled }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");

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
    onJoin(roomCode, password);
    closeModal();
  }

  const joinModal = (
    <Modal modalRef={modalRef} onClose={closeModal}>
      <>
        {/* TODO - Añadir validación con react-forms */}

        <form onSubmit={handleJoin}>
          <fieldset>
            <label htmlFor="roomCode" className="text-lg font-semibold mb-2">
              Room Code
            </label>
            <input
              type="text"
              id="roomCode"
              className="border border-gray-400 rounded-lg p-2 mb-6 outline-none
            focus:ring-2 focus:ring-primary-400 bg-gray-100 w-full"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
          </fieldset>

          <fieldset className="mb-6">
            <PasswordInput
              id="create-roomCode"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </fieldset>
        </form>

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
      </>
    </Modal>
  );

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

      {joinModal}
    </>
  );
}
