import passport from "passport";
import { NextFunction, Request, Response } from "express";

export const passport_login = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("login", async (err: any, body: any, info: any) => {
    if (err !== null) {
      return res.status(401).json(err);
    }
    if (!body) {
      return res
        .status(info?.status || 401)
        .json({ message: info?.message || "Authentication failed" });
    }
    
    req.body = body;
    next();
  })(req, res, next);
};

export const passport_register = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("register", (err: any, body: any, info: any) => {
    if (err !== null) {
      return res.status(401).json(err);
    }
    if (!body) {
      return res
        .status(info?.status || 401)
        .json({ message: info?.message || "Registration failed" });
    }
    req.body = body;
    next();
  })(req, res, next);
};

export const passport_jwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", { session: false }, (err: any, payload: any, info: any) => {
    if(!payload){
      return res.status(401).json({ status: 401, message: "You're not authenticated to do this action." });
    }
    req.user = payload
    next();
  })(req, res, next);
};