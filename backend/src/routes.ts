import express, { Request, Response } from "express";
import { nanoid } from "nanoid";
import redisClient from "./redis";

const router = express.Router();

router.post("/chat-room", async (req: Request, res: Response) => {
  const { userName } = req.body;
  let roomCode = nanoid(8);

  try {
    while (await redisClient.get(roomCode)) {
      roomCode = nanoid(8);
    }

    const chatRoom = {
      users: [userName],
    };

    await redisClient.set(roomCode, JSON.stringify(chatRoom), {
      EX: 60 * 60 * 24,
    });
    console.log(roomCode);

    res.json({ roomCode });
  } catch (error) {
    console.log(error);
  }
});

const chatRooms = {};

router.post("/chat-room-2", (req: Request, res: Response) => {
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
