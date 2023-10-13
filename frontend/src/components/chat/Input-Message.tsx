import React, { useMemo, useRef } from "react";
import { AiOutlineFileImage, AiOutlineSend } from "react-icons/ai";
import { Socket } from "socket.io-client";
import useAutosizeTextArea from "../../hooks/useAutosizeTextArea";

interface Props {
  socket: Socket | null;
  message: string;
  imagesSelected: FileList | null;
  loadImages: (files: FileList | null) => void;
  handleFormSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    socket: Socket
  ) => void;
  handleMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function InputMessage({
  socket,
  message,
  loadImages,
  imagesSelected,
  handleFormSubmit,
  handleMessageChange,
}: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(textAreaRef.current, message, {
    maxHeight: 10,
    heightUnit: "vh",
  });

  const canSubmit: boolean = useMemo(
    () => message.length > 0 || !!imagesSelected,
    [message, imagesSelected]
  );

  const disabled: boolean = useMemo(
    () => socket?.disconnected ?? true,
    [socket?.disconnected]
  );

  return (
    <form
      ref={formRef}
      onSubmit={(e) => handleFormSubmit(e, socket!)}
      className="flex items-center mt-auto bg-white p-2 rounded-md focus-within:ring-2
            ring-offset-2 ring-secondary-600 "
    >
      <textarea
        ref={textAreaRef}
        disabled={disabled}
        placeholder="Write your message..."
        className="placeholder-primary-300 resize-none w-full h-[26px]
          outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        value={message}
        onChange={handleMessageChange}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
      />
      <input
        type="file"
        id="file"
        hidden={true}
        disabled={disabled}
        accept="image/*"
        className="peer"
        onChange={(event) => loadImages(event.target.files)}
      />

      <label
        htmlFor="file"
        className="ml-auto cursor-pointer relative
        peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
      "
      >
        <AiOutlineFileImage
          size={28}
          className="text-primary-400 hover:text-primary-500"
        />

        {imagesSelected && imagesSelected.length >= 1 && (
          <span className="absolute -top-2 -left-1 text-xs bg-primary-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
            {imagesSelected?.length}
          </span>
        )}
      </label>

      <button
        disabled={!canSubmit || disabled}
        className="ml-2 bg-secondary-100 rounded-full p-2 
          disabled:opacity-50 disabled:cursor-not-allowed"
        // onClick={() => socket.disconnect()}
        // type="button"
        type="submit"
      >
        <AiOutlineSend
          size={24}
          className="text-primary-400 hover:text-primary-500"
        />
      </button>
    </form>
  );
}
