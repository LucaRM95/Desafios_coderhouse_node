import express, { IRouter, NextFunction, Request, Response } from "express";
import { tokenGenerator } from "../../services/helpers/auth/token_helpers";
import {
  passport_jwt,
  passport_login,
  passport_register,
} from "../../services/helpers/auth/passport_function";
import { validateRegisterData } from "../../middlewares/auth/validateRegisterData";
import UserController from "../../controllers/user/UserController";

const userRouter: IRouter = express.Router();

const cookieOpts = {
  maxAge: 2 * 60 * 60 * 1000,
  httpOnly: true,
  signed: true,
};

userRouter.get("/users/premium/:uid", async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req.params;
    await UserController.changeUserRole(uid);
    
    res.status(200).json({ message: "You role has been changed." })
  } catch (error) {
    next(error)
  }
});

userRouter.post(
  "/login",
  passport_login,
  (req: Request, res: Response, next: NextFunction) => {
    const token = tokenGenerator(req.body.user);

    return res
      .cookie("access_token", token, cookieOpts)
      .status(200)
      .json({ status: 200, message: "You have logged successfully." });
  }
);

userRouter.get(
  "/sendResetPasswordEmail",
  passport_jwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email }: any = req.user;
    try {
      await UserController.requestPasswordReset(email);
      res.status(200).json({
        message:
          "Correo de restablecimiento de contraseña enviado correctamente",
      });
    } catch (error) {
      next(error);
    }
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

userRouter.get(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.resetPassword(req);
      res.status(200).json({ message: "Página de reseteo de password" });
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
