import { useEffect } from "react";
import { io } from "socket.io-client";

import Blobs from "./components/Blobs";
import { AiOutlineFileImage, AiOutlineSend } from "react-icons/ai";

import Messages from "./components/Messages";
import SelectedImage from "./components/Selected-Image";

import useMessages from "./hooks/useMessages";
import useSelectedImage from "./hooks/useSelectedImage";

const socket = io("/");

export default function App() {
  const {
    message,
    messages,
    receiveMessage,
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

  function handleFileChange(files: FileList | null) {
    if (!files) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result?.toString();
      if (base64String) {
        if (base64String.length > 1000000) {
          alert("File size must be less than 1 MB");
          return;
        }

        receiveMessage(
          {
            text: message,
            image: base64String,
            id: "Me",
          },
          false
        );
        socket.emit("image", {
          image: base64String,
          text: message,
        });
      }
    };

    reader.readAsDataURL(file);
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
          min-h-[80vh] w-[80vw] max-w-[600px] max-h-[600px] overflow-y-auto 
        "
        >
          <h1 className="text-4xl font-bold mb-6">Private Chat</h1>

          <Messages messages={messages} handleImageClick={handleImageClick} />

          <form
            onSubmit={(e) => handleFormSubmit(e, socket)}
            className="flex items-center  mt-auto bg-white p-2 rounded-md focus-within:ring-2
            ring-offset-2 ring-secondary-600 "
          >
            {/* TODO - Handle resize */}
            <input
              placeholder="Write your message..."
              className="placeholder-primary-300 resize-none w-full
                outline-none group-focus:ring-2 group-focus:ring-primary-400
              "
              value={message}
              onChange={handleMessageChange}
            />
            <input
              type="file"
              id="file"
              hidden={true}
              accept="image/*"
              onChange={(event) => handleFileChange(event.target.files)}
            />

            <label htmlFor="file" className="ml-auto cursor-pointer">
              <AiOutlineFileImage
                size={28}
                className="text-primary-400 hover:text-primary-500"
              />
            </label>

            <button
              className="ml-2 bg-secondary-100 rounded-full p-2"
              type="submit"
            >
              <AiOutlineSend
                size={24}
                className="text-primary-400 hover:text-primary-500"
              />
            </button>
          </form>
        </main>

        <SelectedImage
          selectedImage={selectedImage}
          handleCloseClick={handleCloseClick}
        />
      </div>
    </>
  );
}
