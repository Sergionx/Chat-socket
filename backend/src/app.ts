import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { config as configDotENV } from "dotenv";
import { listenImages, listenMessages } from "./listeners";
import routes from "./routes";
import cors from "cors";

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

app.use("/api", routes);

io.on("connection", (socket) => {
  const { roomCode, roomPassword } = socket.handshake.query as {
    roomCode: string;
    roomPassword: string;
  };

  // if (isRoomPrivate(roomCode) && isPasswordRequired(roomCode)) {
  //   // Perform authentication checks here, such as checking if the user has the correct password
  //   if (!isAuthenticated(roomCode, roomPassword)) {
  //     // If the user is not authenticated, disconnect the socket and return an error message
  //     socket.disconnect();
  //     return socket.emit("error", "Invalid password");
  //   }
  // }

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
