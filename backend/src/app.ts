import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { AES } from "crypto-js"; // Import the crypto-js library
import { config as configDotENV } from "dotenv";

configDotENV();

const port = process.env.PORT;
const encryptKey = process.env.ENCRYPT_KEY;

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

// const serverDH = createDiffieHellman(256);
// const serverPublicKey = serverDH.generateKeys();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (message: string) => {
    const encryptedMessage = AES.encrypt(message, encryptKey).toString();

    socket.broadcast.emit("message", {
      body: encryptedMessage,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port);
console.log(`Express server is listening at http://localhost:${port} 🚀`);
