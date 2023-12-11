import express, { IRouter, Request, Response } from "express";
import { tokenGenerator } from "../../services/helpers/auth/token_helpers";
import {
  passport_login,
  passport_register,
} from "../../services/helpers/auth/passport_function";
import { validateRegisterData } from "../../middlewares/auth/validateRegisterData";

const userRouter: IRouter = express.Router();

const cookieOpts = {
  maxAge: 2 * 60 * 60 * 1000,
  httpOnly: true,
  signed: true,
};

userRouter.post(
  "/login",
  passport_login,
  async (req: Request, res: Response) => {
    const token = tokenGenerator(req.body.user);

    return res
      .cookie("access_token", token, cookieOpts)
      .status(200)
      .json({ status: 200, message: "You have logged successfully." });
  }
);

userRouter.post(
  "/register",
  validateRegisterData,
  passport_register,
  async (req: Request, res: Response) => {
    const { result }: any = req.body;

    return res.status(201).json(result);
  }
);

export default userRouter;
