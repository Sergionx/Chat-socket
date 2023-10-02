import express, { Request, Response } from "express";
import { getStatistics, mean, stddev } from "./utils/statistics";
import http from "http";


const router = express.Router();

router.get("/chat-room", async (req: Request, res: Response) => {
  const responseTimes: { [key: string]: number[] } = {};

  const urls = ["/api/chat-room", "/api/chat-room-2"];

  const statistics = {};

  for (const url of urls) {
    responseTimes[url] = [];

    for (let i = 0; i < 10; i++) {
      const start = performance.now();

      try {
        await new Promise<void>((resolve, reject) => {
          const req = http.request(`http://localhost:3000${url}`, (res) => {
            res.on("data", () => {});
            res.on("end", () => {
              resolve();
            });
          });

          req.on("error", (error) => {
            reject(error);
          });

          req.end();
        });
      } catch (error) {
        console.error(error);
      }
      
      const end = performance.now();
      const responseTime = end - start;

      responseTimes[url].push(responseTime);
    }

    const {mean, stddev} = getStatistics(responseTimes[url]);
    statistics[url] = {mean, stddev};
  }

  res.json(statistics);
});

export default router;
