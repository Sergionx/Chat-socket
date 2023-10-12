import { useRef, useState } from "react";
import { Tooltip } from "react-tooltip";

import Messages from "../components/chat/Messages";
import SelectedImage from "../components/chat/Selected-Image";
import InputMessage from "../components/chat/Input-Message";

import useMessages from "../hooks/useMessages";
import useSelectedImage from "../hooks/useSelectedImage";

import { BiPaste } from "react-icons/bi";
import Modal from "../components/Modal";
import PasswordInput from "../components/inputs/Password-Input";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { hashPassword } from "../utils/encryption";

export default function ChatRoom() {
  const passwordModalRef = useRef<HTMLDialogElement>(null);
  const redirectModalRef = useRef<HTMLDialogElement>(null);

  const [password, setPassword] = useState("");
  const [copyClicked, setCopyClicked] = useState(false);
  const navigate = useNavigate();

  function openPasswordModal() {
    passwordModalRef.current?.showModal();

    passwordModalRef.current?.addEventListener("click", (event) => {
      if (event.target === passwordModalRef.current) closePasswordModal();
    });
  }

  function closePasswordModal() {
    passwordModalRef.current?.close();
  }

  function handleJoin() {
    closePasswordModal();

    const socket = io("/", {
      auth: {
        roomCode,
        roomPassword: hashPassword(password),
      },
    });

    socket.on("connect_error", (error) => {
      console.log(error);
      onSocketError({ message: error.message });
    });

    socket.on("connect", () => {
      activateListeners(socket, true);
      navigate(`/${roomCode}`, {
        state: { userName: "Mola", password },
      });
    });
  }

  function openRedirectModal() {
    redirectModalRef.current?.showModal();

    redirectModalRef.current?.addEventListener("click", (event) => {
      if (event.target === redirectModalRef.current) closeRedirectModal();
    });

    setTimeout(() => {
      closeRedirectModal();
      navigate("/");
    }, 5000);
  }

  function closeRedirectModal() {
    redirectModalRef.current?.close();
  }

  const {
    message,
    messages,
    imagesSelected,
    loadImages,
    handleMessageChange,
    handleFormSubmit,
    socket,
    activateListeners,
    roomCode,
  } = useMessages({ onSocketError });

  const { selectedImage, handleCloseClick, handleImageClick } =
    useSelectedImage();

  // TODO - onSendPassword
  const passwordModal = (
    <Modal modalRef={passwordModalRef} onClose={closePasswordModal}>
      <>
        {/* TODO - Añadir validación con react-forms */}

        <form onSubmit={handleJoin}>
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
            onClick={closePasswordModal}
          >
            Cancel
          </button>
        </footer>
      </>
    </Modal>
  );

  const redirectModal = (
    <Modal modalRef={redirectModalRef} onClose={closeRedirectModal}>
      <>
        <h1 className="text-xl font-bold mb-6">
          You will be redirected to the home page in 5 seconds
        </h1>

        <p>
          If you are not redirected, click{" "}
          <Link to="/" className="text-primary-500">
            here
          </Link>
        </p>

        {/* TODO - Add progress bar */}
      </>
    </Modal>
  );

  function onSocketError(error: { message: string }) {
    switch (error.message) {
      case "Room does not exist":
        openRedirectModal();
        break;

      case "Invalid password":
        openPasswordModal();
        break;

      default:
        openRedirectModal();
        break;
    }

    console.log(error);
  }

  return (
    <>
      <main
        className="flex flex-col backdrop-blur-md bg-secondary-200/50 p-8 rounded-md
          min-h-[80vh] w-[80vw] max-w-[600px] max-h-[600px] overflow-y-auto "
      >
        <Tooltip
          id="copy"
          place="top"
          content={copyClicked ? "Copied!" : "Click to copy"}
          className="z-50"
          delayHide={copyClicked ? 300 : 100}
          clickable={true}
        />

        <h1 className="text-4xl font-bold mb-6">
          Private Chat
          <span
            data-tooltip-id="copy"
            className="text-primary-500 font-normal ml-2 cursor-pointer 
              inline-flex items-center"
            onClick={() => {
              navigator.clipboard.writeText(roomCode!);
              setCopyClicked(true);
              setTimeout(() => setCopyClicked(false), 1500);
            }}
          >
            {" "}
            ({roomCode})
            <BiPaste className="mt-1 ml-2" />
          </span>
        </h1>

        <Messages messages={messages} handleImageClick={handleImageClick} />

        <InputMessage
          socket={socket}
          message={message}
          handleFormSubmit={handleFormSubmit}
          loadImages={loadImages}
          handleMessageChange={handleMessageChange}
          imagesSelected={imagesSelected}
        />
      </main>

      {passwordModal}
      {redirectModal}

      <SelectedImage
        selectedImage={selectedImage}
        handleCloseClick={handleCloseClick}
      />
    </>
  );
}
