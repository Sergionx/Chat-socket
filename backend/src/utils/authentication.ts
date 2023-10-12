import redisClient from "../redis";

export async function isRoomPrivate(roomCode: string): Promise<boolean> {
  try {
    const isPrivate = await redisClient.hGet(
      `chatRooms:${roomCode}`,
      "isPrivate"
    );

    return isPrivate === "1";
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function isAuthenticated(
  roomCode: string,
  roomPassword: string
): Promise<boolean> {
  try {
    const roomData = await redisClient.hGetAll(`chatRooms:${roomCode}`);

    if (!roomData) {
      return false;
    }

    const isPrivate = roomData["isPrivate"] === "1";
    const password = roomData["password"];

    return !isPrivate || password === roomPassword;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function roomExists(roomCode: string): Promise<boolean> {
  try {
    const exists = await redisClient.exists(`chatRooms:${roomCode}`);

    return exists === 1;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function shouldJoinRoom(
  roomCode: string,
  roomPassword: string
): Promise<string> {
  if (!(await roomExists(roomCode))) {
    return "Room does not exist";
  }

  if (!(await isAuthenticated(roomCode, roomPassword))) {
    return "Invalid password";
  }

  return "";
}
