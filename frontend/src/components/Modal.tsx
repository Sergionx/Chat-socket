import React, { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  modalRef: React.RefObject<HTMLDialogElement>;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ children, modalRef: ref, onClose }: Props) {

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="backdrop:bg-black/50 backdrop:backdrop-blur-sm
          rounded-lg shadow-lg p-0 relative"
    >
      <main
        className="flex flex-col w-56 sm:w-72 px-4 pb-4 py-8
            border border-gray-400 "
      >
        <button
          className="absolute sm:right-3 sm:top-3 right-1 top-1
            hover:bg-gray-200 p-2 rounded-md active:bg-gray-300"
          onClick={onClose}
        >
          <AiOutlineClose size={16} />
        </button>

        {children}
      </main>
    </dialog>
  );
}
