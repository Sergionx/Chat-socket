import React, { useState } from "react";
import { SocketMessage } from "../models/SocketMessage";
import { AES, enc } from "crypto-js";
import { Socket } from "socket.io-client";

export default function useMessages() {
  const [message, setMessage] = useState("");
  const [imagesSelected, setImagesSelected] = useState<FileList | null>(null);
  const [messages, setMessages] = useState<SocketMessage[]>([]);

  function receiveMessage(newMessage: SocketMessage, decrypt: boolean): void {
    console.log(newMessage);
    newMessage.text =
      decrypt && newMessage.text
        ? decryptString(newMessage.text)
        : newMessage.text;

    newMessage.image =
      decrypt && newMessage.image
        ? decryptString(newMessage.image)
        : newMessage.image;

    setMessages((oldMessages) => [...oldMessages, newMessage]);
  }

  function decryptString(data: string): string {
    return AES.decrypt(data, import.meta.env.VITE_ENCRYPT_KEY).toString(
      enc.Utf8
    );
  }

  function handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
  }

  function handleFormSubmit(
    event: React.FormEvent<HTMLFormElement>,
    socket: Socket
  ) {
    event.preventDefault();

    if (imagesSelected) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString();
        if (base64String) {
          // TODO - Better alert
          if (base64String.length > 1000000) {
            alert("File size must be less than 1 MB");
            return;
          }

          socket.emit("image", {
            image: base64String,
            text: message,
          });
          receiveMessage(
            {
              text: message,
              image: base64String,
              id: "Me",
            },
            false
          );
        }
      };

      reader.readAsDataURL(imagesSelected[0]);
    } else {
      socket.emit("message", message);
      receiveMessage(
        {
          text: message,
          id: "Me",
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
  };
}
