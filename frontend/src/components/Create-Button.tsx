import { useRef, useState } from "react";
import Switch from "./inputs/Switch";
import PasswordInput from "./inputs/Password-Input";
import Modal from "./Modal";

interface Props {
  onCreate: (password: string, isPrivate: boolean) => void;
  disabled: boolean;
}

export default function CreateButton({ onCreate, disabled }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");

  function openModal() {
    modalRef.current?.showModal();

    modalRef.current?.addEventListener("click", (event) => {
      if (event.target === modalRef.current) closeModal();
    });
  }

  function closeModal() {
    modalRef.current?.close();
    setPassword("");
  }

  function handleCreate() {
    onCreate(password, isPrivate);
    closeModal();
  }

  const createModal = (
    <Modal modalRef={modalRef} onClose={closeModal}>
      <>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <fieldset className="flex gap-4 items-center">
            <label htmlFor="isRoomPrivate" className="text-lg font-semibold">
              Private Room
            </label>

            <Switch
              id="isRoomPrivate"
              value={isPrivate}
              onCheck={setIsPrivate}
            />
          </fieldset>

          <fieldset className="mb-6">
            <PasswordInput
              id="join-roomCode"
              disabled={!isPrivate}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </fieldset>
        </form>

        <footer className="flex flex-row-reverse gap-4 pt-4 border-t border-gray-500">
          <button
            disabled={isPrivate && !password}
            className="px-4 py-2 rounded-md bg-primary-400 text-white
                hover:bg-primary-500 hover:ring-2 hover:ring-primary-400
                active:bg-primary-700 active:ring-2 active:ring-primary-700 disabled:active:scale-95
                  disabled:opacity-50 disabled:pointer-events-none"
            onClick={handleCreate}
          >
            Create a Room
          </button>
          <button
            className="px-4 py-2 border rounded-md border-gray-200
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

  // TODO - Añadir minimos requeriminetos para la contraseña
  return (
    <>
      <button
        disabled={disabled}
        className="px-6 py-3.5 border-2 border-primary-400 basis-1/2 rounded-lg
        font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={openModal}
      >
        Create chat
      </button>

      {createModal}
    </>
  );
}
