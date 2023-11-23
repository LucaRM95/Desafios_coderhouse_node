import path from "path";
import dotenv from "dotenv";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { UserModel } from "../interfaces/UserInterface";
import { NextFunction, Request, Response } from "express";

dotenv.config();

export const __dirname = path.resolve();
const JWT_SECRET: string = process.env.JWT_SECRET || "";

export const hashPass = (pass: string) =>
  bycrypt.hashSync(pass, bycrypt.genSaltSync(10));

export const validatePass = (pass: string, user: UserModel) =>
  bycrypt.compareSync(pass, user.password);

export const tokenGenerator = (user: UserModel) => {
  const { _id, first_name, last_name, email } = user;
  const payload = {
    id: _id,
    first_name,
    last_name,
    email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "10s" });
};

export const verifyToken = (token: any) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error: any, payload: any) => {
      if (error) {
        return reject(error);
      }
      resolve(payload);
    });
  });
};

export const authMiddleware =
  (strategy: any) => (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      strategy,
      function (error: any, user: any, info: any) {
        console.log(info)
        if (error) {
          return next(error);
        }
        if (!user) {
          return res.render("login", {
            message: info.message ? info.message : info.toString(),
          });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
