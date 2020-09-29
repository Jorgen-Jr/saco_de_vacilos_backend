import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request & { session: Express.Session };
  redis: Redis.Redis;
  res: Response;
};
