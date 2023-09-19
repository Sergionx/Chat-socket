import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new SocketServer(
  server
  //   {
  //   cors: {
  //     origin: "http://localhost:5173",
  //   },
  // }
);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (message: string) => {
    socket.broadcast.emit("message", {
      body: message,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port);
console.log(`Express server is listening at http://localhost:${port} 🚀`);
