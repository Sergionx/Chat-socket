import { useEffect } from "react";
import { io } from "socket.io-client";

import Blobs from "./components/Blobs";

import Messages from "./components/Messages";
import SelectedImage from "./components/Selected-Image";

import useMessages from "./hooks/useMessages";
import useSelectedImage from "./hooks/useSelectedImage";
import InputMessage from "./components/Input-Message";

const socket = io("/");

export default function App() {
  const {
    message,
    messages,
    receiveMessage,
    imagesSelected,
    loadImages,
    handleMessageChange,
    handleFormSubmit,
  } = useMessages();

  const { selectedImage, handleCloseClick, handleImageClick } =
    useSelectedImage();

  useEffect(() => {
    socket.on("message", (message) => receiveMessage(message, true));

    return () => turnOffSoccket();
  }, []);

  function turnOffSoccket() {
    socket.off("message");
  }

  // TODO - Add images
  return (
    <>
      <div
        className="bg-primary-400/40 min-h-screen  
          grid place-items-center"
      >
        <Blobs />
        <main
          className="flex flex-col backdrop-blur-md bg-secondary-200/50 p-8 rounded-md
          min-h-[80vh] w-[80vw] max-w-[600px] max-h-[600px] overflow-y-auto "
        >
          <h1 className="text-4xl font-bold mb-6">Private Chat</h1>

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

        <SelectedImage
          selectedImage={selectedImage}
          handleCloseClick={handleCloseClick}
        />
      </div>
    </>
  );
}
