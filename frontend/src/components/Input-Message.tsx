import React from "react";
import { AiOutlineFileImage, AiOutlineSend } from "react-icons/ai";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  message: string;
  loadImages: (files: FileList | null) => void;
  handleFormSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    socket: Socket
  ) => void;
  handleMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputMessage({
  socket,
  message,
  loadImages,
  handleFormSubmit,
  handleMessageChange,
}: Props) {
  return (
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
        onChange={(event) => loadImages(event.target.files)}
      />

      <label htmlFor="file" className="ml-auto cursor-pointer">
        <AiOutlineFileImage
          size={28}
          className="text-primary-400 hover:text-primary-500"
        />
      </label>

      <button className="ml-2 bg-secondary-100 rounded-full p-2" type="submit">
        <AiOutlineSend
          size={24}
          className="text-primary-400 hover:text-primary-500"
        />
      </button>
    </form>
  );
}
