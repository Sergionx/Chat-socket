import { useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible, AiOutlineClose } from "react-icons/ai";
import Switch from "./inputs/Switch";

interface Props {
  onCreate: (roomCode: string) => void;
  disabled: boolean;
}

// TODO - Create modal component
export default function CreateButton({ onCreate, disabled }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

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

  function handleJoin() {
    onCreate(password);
    closeModal();
  }

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

      <dialog
        ref={modalRef}
        onClose={closeModal}
        className="backdrop:bg-black/50 backdrop:backdrop-blur-sm
          rounded-lg shadow-lg p-0 relative"
      >
        <main
          className="flex flex-col w-56 sm:w-72 px-4 pb-4 py-8
            border border-gray-400 "
        >
          <button
            className="absolute sm:right-3 sm:top-3 right-1 top-1
            hover:bg-gray-200 p-2 rounded-md"
            onClick={closeModal}
          >
            <AiOutlineClose size={16} />
          </button>

          <form className="flex flex-col gap-4">
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

            <fieldset>
              <label htmlFor="roomCode" className="text-lg font-semibold mb-2">
                Password
              </label>

              {/* REVIEW - HAcerlo componente? */}
              <section
                className="border border-gray-400 rounded-lg p-2 mb-6 
              focus-within:ring-2 focus-within:ring-primary-400 bg-gray-100
              flex items-center"
              >
                <input
                  type={isPasswordHidden ? "password" : "text"}
                  id="roomCode"
                  className="outline-none w-full bg-gray-100"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button onClick={() => setIsPasswordHidden(!isPasswordHidden)}>
                  {isPasswordHidden ? (
                    <AiFillEye
                      size={24}
                      className="text-primary-400 hover:text-primary-500"
                    />
                  ) : (
                    <AiFillEyeInvisible
                      size={24}
                      className="text-primary-400 hover:text-primary-500"
                    />
                  )}
                </button>
              </section>
            </fieldset>
          </form>

          <footer className="flex flex-row-reverse gap-4 pt-4 border-t border-gray-500">
            <button
              disabled={isPrivate && !password}
              className="px-4 py-2 rounded-md bg-primary-400 text-white
                hover:bg-primary-500 hover:ring-2 hover:ring-primary-400
                active:bg-primary-700 active:ring-2 active:ring-primary-700 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleJoin}
            >
              Create a Room
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
