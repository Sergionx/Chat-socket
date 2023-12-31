import { useState } from "react";
import { Socket } from "socket.io-client";

import { SocketMessage } from "../models/SocketMessage";

import useSocket from "./useSocket";
import useAuth from "./useAuth";
import { decryptString } from "../utils/encryption";
import { SocketError } from "../utils/errors";

interface Props {
  onSocketError: (error: { messages: SocketError[] }) => void;
}

export default function useMessages({ onSocketError }: Props) {
  const [message, setMessage] = useState("");
  const [imagesSelected, setImagesSelected] = useState<FileList | null>(null);
  const [messages, setMessages] = useState<SocketMessage[]>([]);

  const { userName, password } = useAuth();

  const { roomCode, socket, activateListeners } = useSocket({
    userName,
    password,
    receiveMessage,
    onSocketError,
  });

  function receiveMessage(newMessage: SocketMessage, decrypt: boolean): void {
    newMessage.text =
      decrypt && newMessage.text
        ? decryptString(newMessage.text)
        : newMessage.text;

    newMessage.image =
      decrypt && newMessage.image
        ? decryptString(newMessage.image)
        : newMessage.image;

    newMessage.sendedAt =
      newMessage.userName === "Me"
        ? newMessage.sendedAt
        : new Date(newMessage.sendedAt);

    setMessages((oldMessages) => [...oldMessages, newMessage]);
  }

  function handleMessageChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
  }

  function handleFormSubmit(
    event: React.FormEvent<HTMLFormElement>,
    socket: Socket
  ) {
    event.preventDefault();
    // TODO - Mejor manera de hacer esto
    // if (!userName) {
    //   return;
    // }

    if (imagesSelected) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString();
        if (base64String) {
          // TODO - Better alert
          const MB = 1000000;
          if (base64String.length > 6 * MB) {
            alert("File size must be less than 6 MB");
            return;
          }

          const imageMessage: SocketMessage = {
            text: message,
            image: base64String,
            userName: userName,
            sendedAt: new Date(),
          };

          socket.emit("image", {
            image: base64String,
            text: message,
          });
          receiveMessage(
            {
              ...imageMessage,
              userName: "Me",
            },
            false
          );
          console.log(new Date());
        }
      };

      reader.readAsDataURL(imagesSelected[0]);
    } else {
      const textMessage: SocketMessage = {
        text: message,
        userName: userName,
        sendedAt: new Date(),
      };

      socket.emit("message", textMessage);
      receiveMessage(
        {
          ...textMessage,
          userName: "Me",
        },
        false
      );
    }

    setMessage("");
    setImagesSelected(null);
  }

  function loadImages(files: FileList | null) {
    if (!files) {
      return;
    }
    setImagesSelected(files);
  }

  return {
    messages,
    message,
    imagesSelected,
    loadImages,
    receiveMessage,
    handleMessageChange,
    handleFormSubmit,
    socket,
    activateListeners,
    roomCode,
  };
}
