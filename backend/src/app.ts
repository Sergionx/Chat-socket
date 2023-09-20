import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { config as configDotENV } from "dotenv";
import { listenImages, listenMessages } from "./listeners";


configDotENV();

const port = process.env.PORT;
const encryptKey = process.env.ENCRYPT_KEY;

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

// const serverDH = createDiffieHellman(256);
// const serverPublicKey = serverDH.generateKeys();

io.on("connection", (socket) => {
  // console.log("A user connected");

  listenMessages(socket, encryptKey)

  listenImages(socket, encryptKey);

  socket.on("disconnect", () => {
    // console.log("A user disconnected");
  });
});

server.listen(port);
console.log(`Express server is listening at http://localhost:${port} 🚀`);
