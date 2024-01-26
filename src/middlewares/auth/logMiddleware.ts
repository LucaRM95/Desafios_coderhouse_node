import { Request, Response, NextFunction } from "express";

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Llama al siguiente middleware en la cadena
};
