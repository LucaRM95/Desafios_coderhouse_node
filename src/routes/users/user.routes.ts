import express, { IRouter, Request, Response } from "express";
import User from "../../models/user/user.models";
import { UserModel } from "../../interfaces/UserInterface";
import { hashPass, validatePass } from "../../helpers/utils";
import { validateRegisterData } from "../../middlewares/auth/validateRegisterData";

const userRouter: IRouter = express.Router();

userRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: UserModel | any = await User.findOne({ email: email });
  const isValidPassword = validatePass(password, user);
  
  if(!isValidPassword){
    return res.render('login', { message: "La contraseña o correo son invalidas." });
  }
  
  (req.session as any).user = {
    first_name: user?.first_name,
    last_name: user?.last_name,
    role: user?.role,
    email,
  };
  return res.redirect("/api/products?limit=2&page=1");
});

userRouter.post("/register", validateRegisterData, async (req: Request, res: Response) => {
  const { body } = req;
  const user = await User.create({
    ...body,
    role: "USER",
    password: hashPass(body?.password),
  });
  
  (req.session as any).user = {
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
  };
  return res.redirect("/api/products?limit=2&page=1");
});

userRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/login");
  });
});

export default userRouter;
