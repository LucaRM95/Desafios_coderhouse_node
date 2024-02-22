import passport from "passport";
import { NextFunction, Request, Response } from "express";
import UserController from "../../../controllers/user/UserController";
import UnauthorizedException from "../../errors/UnauthorizedException";

export const passport_login = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("login", async (err: any, body: any, info: any) => {
    try {
      const { email, password } = req.body;
      if (err !== null) {
        throw new UnauthorizedException(err?.message);
      }

      await UserController.loginUser(email, password);

      if (!body) {
        throw new UnauthorizedException(
          info?.message || "Authentication failed"
        );
      }

      req.body = body;
      next();
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

export const passport_register = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("register", async (err: any, body: any, info: any) => {
    try {
      if (err !== null) {
        throw new UnauthorizedException(err?.message);
      }

      if (!body) {
        throw new UnauthorizedException(info?.message || "Registration failed");
      }
      req.body = body;
      next();
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

export const passport_jwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, payload: any, info: any) => {
      try {
        if (!payload) {
          throw new UnauthorizedException(
            "You're not authenticated to do this action."
          );
        }
        req.user = payload;
        next();
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};
