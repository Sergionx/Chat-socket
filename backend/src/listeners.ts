import { AES } from "crypto-js";
import { Socket } from "socket.io";
import * as fs from "fs/promises";
import { SocketMessage } from "./models/SocketMessage";

export function listenMessages(socket: Socket, encryptKey: string) {
  socket.on("message", (message: string) => {
    const encryptedMessage = AES.encrypt(message, encryptKey).toString();

    const socketMessage: SocketMessage = {
      text: encryptedMessage,
      id: socket.id,
      sendedAt: new Date(),
    };

    socket.broadcast.emit("message", socketMessage);
  });
}

export function listenImages(socket: Socket, encryptKey: string) {
  socket.on(
    "image",
    async ({ image, text }: { image: string; text: string }) => {
      const encryptedBase64String = AES.encrypt(image, encryptKey).toString();

      const socketMessage: SocketMessage = {
        id: socket.id,
        image: encryptedBase64String,
        text: text ? AES.encrypt(text, encryptKey).toString() : "",
        sendedAt: new Date(),
      };

      socket.broadcast.emit("message", socketMessage);
    }
  );
}
