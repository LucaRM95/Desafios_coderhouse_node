// logger.ts

import winston from "winston";
import dotenv from "./dotenv.config";
import express, { NextFunction, Request, Response } from "express";

export interface CustomRequest extends Request {
  logger: winston.Logger;
}

declare global {
  namespace Express {
    interface Request {
      logger: winston.Logger;
    }
  }
}

const customLevelsOptions = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warning: "yellow",
    info: "blue",
    debug: "white",
  },
};

const loggerProd = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "./error.log", level: "warn" }),
  ],
});

const loggerDev = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "./error.log", level: "debug" }),
    new winston.transports.Console({ level: "verbose" }),
  ],
});

export const addLogger: express.RequestHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  req.logger = dotenv.ENV === "prod" ? loggerProd : loggerDev;
  next();
};
