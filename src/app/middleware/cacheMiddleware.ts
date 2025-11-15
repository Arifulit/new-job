import { Request, Response, NextFunction } from "express";
import redis from "redis";

const client = redis.createClient({ url: process.env.REDIS_URL });

client.connect().catch(console.error);

export const cacheMiddleware = (keyPrefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = keyPrefix + req.originalUrl;
    try {
      const cachedData = await client.get(key);
      if (cachedData) {
        return res.status(200).json({
          success: true,
          data: JSON.parse(cachedData),
          cached: true
        });
      }
      res.sendResponse = res.json;
      res.json = async (body: any) => {
        await client.setEx(key, 3600, JSON.stringify(body)); // cache for 1 hour
        res.sendResponse(body);
      };
      next();
    } catch (err) {
      next();
    }
  };
};
