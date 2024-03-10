import express, { IRouter, NextFunction, Request, Response } from "express";
import SessionController from "../../controllers/session/SessionController";
import { validateRegisterData } from "../../middlewares/auth/validateRegisterData";
import { passport_jwt, passport_login, passport_register } from "../../services/helpers/auth/passport_function";
import UserController from "../../controllers/user/UserController";
import { tokenGenerator } from "../../services/helpers/auth/token_helpers";

const authRouter: IRouter = express.Router();

const cookieOpts = {
  maxAge: 2 * 60 * 60 * 1000,
  httpOnly: true,
  signed: true,
};

authRouter.post(
  "/login",
  passport_login,
  (req: Request, res: Response, next: NextFunction) => {
    const token = tokenGenerator(req.body.user);

    return res
      .cookie("access_token", token, cookieOpts)
      .status(200)
      .json({ status: 200, token });
  }
);

authRouter.get(
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

authRouter.post(
  "/register",
  validateRegisterData,
  passport_register,
  async (req: Request, res: Response) => {
    const { result }: any = req.body;

    return res.status(201).json(result);
  }
);

authRouter.post(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.resetPassword(req);
      
      res.status(200).json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.get("/current-session", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await SessionController.currentSession(req);
  
    return res.status(200).json(session);
  } catch (error) {
    next(error);
  }  
});

authRouter.get("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logout_res = await SessionController.logoutSession(req, res);
  
    return res.status(200).json(logout_res);
  } catch (error) {
    next(error);
  }
});

export default authRouter;
