import express, { Request, Response } from "express";
import { nanoid } from "nanoid";
import redisClient from "./redis";
import { roomExists } from "./utils/authentication";

interface ChatRoomRequest {
  userName: string;
  isPrivate: boolean;
  password: string;
}

const router = express.Router();

// TODO - Add expiration to chat rooms
router.post("/chat-room", async (req: Request, res: Response) => {
  const { isPrivate, password }: ChatRoomRequest = req.body;
  
  if (!isPrivate || !password)
    return res.status(400).json({ error: "Invalid request" });

  let roomCode = nanoid(8);

  try {
    while (await roomExists(roomCode)) {
      roomCode = nanoid(8);
    }

    const chatRoom = {
      isPrivate: +isPrivate,
      password,
    };
    console.log(chatRoom, isPrivate);

    await redisClient.hSet(`chatRooms:${roomCode}`, chatRoom);
    redisClient.expire(`chatRooms:${roomCode}`, 60 * 60 * 24);

    res.json({ roomCode });
  } catch (error) {
    console.log(error);
  }
});

export default router;
