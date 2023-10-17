import express from "express";
import http from "http";
import cors from "cors";

import { Server as SocketServer } from "socket.io";
import { config as configDotENV } from "dotenv";
import responseTime from "response-time";

import routes from "./routes";
import { listenImages, listenMessages } from "./listeners";
import { shouldJoinRoom } from "./utils/authentication";

configDotENV();

const port = process.env.PORT;
const encryptKey = process.env.ENCRYPT_KEY;

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());

app.use("/api", routes);

io.on("connection", async (socket) => {
  const { roomCode, roomPassword, userName } = socket.handshake.auth as {
    roomCode: string;
    roomPassword: string;
    userName: string;
  };

  const connectionMessage = await shouldJoinRoom(roomCode, roomPassword, userName);
  if (connectionMessage.length > 0) {
    socket.emit("error", {
      messages: connectionMessage,
    });
    return socket.disconnect(true);
  }

  console.log("A user connected");
  socket.join(roomCode);

  listenMessages(socket, encryptKey);

  listenImages(socket, encryptKey);

  socket.on("disconnect", () => {
    socket.leave(roomCode);
    console.log("A user disconnected");
  });
});

server.listen(port);
console.log(`Express server is listening at http://localhost:${port} 🚀`);
