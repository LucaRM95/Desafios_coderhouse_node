import express, { IRouter, Request, Response } from "express";
import { tokenGenerator } from "../../services/helpers/auth/token_helpers";
import { passport_login, passport_register } from "../../services/helpers/auth/passport_function";
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
    try {
      const { user, result }: any = req.body;
      
      if(!user){
        return res.status(401).json(result);
      }

      const token = tokenGenerator(user);

      return res
        .cookie("access_token", token, cookieOpts)
        .status(200)
        .json(result);
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
);

userRouter.post(
  "/register",
  validateRegisterData,
  passport_register,
  async (req: Request, res: Response) => {
    try {
      const { result, newUser }: any = req.body;

      if(!newUser){
        return res.status(401).json(result);
      }
  
      const token = tokenGenerator(newUser);
  
      return res
        .cookie("access_token", token, cookieOpts)
        .status(201)
        .json(result);
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
);

userRouter.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("access_token");
  return res.status(200).json({ status: 200, message: 'Cookie cleared successfully.' });
});

export default userRouter;
