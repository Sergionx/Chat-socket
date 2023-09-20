import { AES } from "crypto-js";
import { Socket } from "socket.io";
import * as fs from "fs/promises";
import { SocketMessage } from "./models/SocketMessage";

export function listenMessages(socket: Socket, encryptKey: string) {
  socket.on("message", (message: string) => {
    const encryptedMessage = AES.encrypt(message, encryptKey).toString();

    const socketMessage: SocketMessage = {
      body: encryptedMessage,
      id: socket.id,
      type: "text",
    };

    socket.broadcast.emit("message", socketMessage);
  });
}

export function listenImages(socket: Socket, encryptKey: string) {
  socket.on("image", async (base64String: string) => {
    const encryptedBase64String = AES.encrypt(
      base64String,
      encryptKey
    ).toString();

    const socketMessage: SocketMessage = {
      body: encryptedBase64String,
      id: socket.id,
      type: "image",
    };

    socket.broadcast.emit("message", socketMessage);
  });
}
