import express, { Request, Response } from "express";
import { nanoid } from "nanoid";
const router = express.Router();

const chatRooms = {};

router.post("/chat-room", (req: Request, res: Response) => {
  const { userName } = req.body;

  let roomCode = nanoid(8);

  while (chatRooms[roomCode]) {
    roomCode = nanoid(8);
  }

  chatRooms[roomCode] = {
    users: [userName],
  };

  res.json({ roomCode });
  console.log(chatRooms);
});

export default router;
