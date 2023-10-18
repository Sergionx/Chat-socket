import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { BiPaste } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import { io } from "socket.io-client";

import Messages from "../components/chat/Messages";
import SelectedImage from "../components/chat/Selected-Image";
import InputMessage from "../components/chat/Input-Message";
import Modal from "../components/Modal";
import PasswordInput from "../components/inputs/Password-Input";

import useMessages from "../hooks/useMessages";
import useSelectedImage from "../hooks/useSelectedImage";
import useAuth from "../hooks/useAuth";

import { hashPassword } from "../utils/encryption";
import { SocketError, showError } from "../utils/errors";
import ProgressBar from "../components/Progress-Bar";

export default function ChatRoom() {
  const passwordModalRef = useRef<HTMLDialogElement>(null);
  const redirectModalRef = useRef<HTMLDialogElement>(null);

  const { userName, password } = useAuth();

  const [passwordModal, setPasswordModal] = useState(password);
  const [userNameModal, setUserNameModal] = useState(userName);
  const [socketErrors, setSocketErrors] = useState<SocketError[]>([]);

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
        roomPassword: hashPassword(passwordModal),
        userName: userNameModal,
      },
    });

    socket.on("connect", () => {
      activateListeners(socket, true);
      navigate(`/${roomCode}`, {
        state: { userName: userNameModal, password: passwordModal },
      });
    });
  }

  function openRedirectModal() {
    redirectModalRef.current?.showModal();

    redirectModalRef.current?.addEventListener("click", (event) => {
      if (event.target === redirectModalRef.current) closeRedirectModal();
    });
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

  const fieldsModal = (
    <Modal modalRef={passwordModalRef} onClose={closePasswordModal}>
      <>
        {/* TODO - Añadir validación con react-forms */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJoin;
          }}
        >
          {socketErrors.includes(SocketError.INVALID_USERNAME) && (
            <fieldset className="mb-6">
              <label htmlFor="userName" className="text-lg font-semibold ">
                Username
              </label>

              <input
                value={userNameModal}
                onChange={(event) => setUserNameModal(event.target.value)}
                className="border border-gray-400 rounded-lg p-2 mt-2 w-full
                  focus:ring-2 focus:ring-primary-400 bg-gray-100 outline-none"
              />
            </fieldset>
          )}

          {socketErrors.includes(SocketError.INVALID_PASSWORD) && (
            <fieldset className="mb-6">
              <PasswordInput
                id="create-roomCode"
                value={passwordModal}
                onChange={(event) => setPasswordModal(event.target.value)}
              />
            </fieldset>
          )}
        </form>

        <footer className="pt-4 border-t border-gray-500">
          <ul className="marker:text-red-500 list-disc pl-5 space-y-3 text-red-400 mb-4">
            {socketErrors.map((error, index) => (
              <li key={index}>{showError(error)}</li>
            ))}
          </ul>

          <section className="flex flex-row-reverse gap-4">
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
          </section>
        </footer>
      </>
    </Modal>
  );

  const redirectModal = (
    <Modal modalRef={redirectModalRef} onClose={closeRedirectModal}>
      <>
        <h1 className="text-xl font-bold mb-6">The room does not existe</h1>

        <p className="text-gray-500 mb-4">
          You will be redirected to the home page in 5 seconds
        </p>

        <p>
          If you are not redirected, click{" "}
          <Link to="/" className="text-primary-500">
            here
          </Link>
        </p>

        <ProgressBar
          seconds={5}
          onEnd={() => {
            closeRedirectModal();
            navigate("/");
          }}
        />
      </>
    </Modal>
  );

  function onSocketError(error: { messages: SocketError[] }) {
    if (error.messages.length === 0) return;

    setSocketErrors(error.messages);

    for (const message of error.messages) {
      if (message === SocketError.ROOM_DOES_NOT_EXIST) {
        openRedirectModal();
        return;
      }

      if (
        message === SocketError.INVALID_USERNAME ||
        message === SocketError.INVALID_PASSWORD
      ) {
        openPasswordModal();
        return;
      }
    }
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

      {fieldsModal}
      {redirectModal}

      <SelectedImage
        selectedImage={selectedImage}
        handleCloseClick={handleCloseClick}
      />
    </>
  );
}
