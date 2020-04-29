import { NextFunction } from "express";
import { createLogger } from "../ts-commonutil/logging/console-logger";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
