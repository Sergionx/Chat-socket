import Messages from "../components/Messages";
import SelectedImage from "../components/Selected-Image";

import useMessages from "../hooks/useMessages";
import useSelectedImage from "../hooks/useSelectedImage";
import InputMessage from "../components/Input-Message";
import { Tooltip } from "react-tooltip";
import { useState } from "react";

export default function ChatRoom() {
  const [copyClicked, setCopyClicked] = useState(false);

  const {
    message,
    messages,
    imagesSelected,
    loadImages,
    handleMessageChange,
    handleFormSubmit,
    socket,
    roomCode,
  } = useMessages();

  const { selectedImage, handleCloseClick, handleImageClick } =
    useSelectedImage();

  return (
    <>
      <main
        className="flex flex-col backdrop-blur-md bg-secondary-200/50 p-8 rounded-md
          min-h-[80vh] w-[80vw] max-w-[600px] max-h-[600px] overflow-y-auto "
      >
        <Tooltip
          id="copy"
          place="bottom"
          content={copyClicked ? "Copied!" : "Click to copy"}
          className="z-50"
          delayHide={copyClicked ? 300 : 100}
          clickable={true}
        />

        <h1 className="text-4xl font-bold mb-6">
          Private Chat
          <span
            data-tooltip-id="copy"
            className="text-primary-500  font-normal ml-2 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(roomCode!);
              setCopyClicked(true);
              setTimeout(() => setCopyClicked(false), 1000);
            }}
          >
            {" "}
            ({roomCode})
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

      <SelectedImage
        selectedImage={selectedImage}
        handleCloseClick={handleCloseClick}
      />
    </>
  );
}
