import express, { IRouter, Request, Response } from "express";
import { UserModel } from "../../services/interfaces/UserInterface";
import { hashPass } from "../../services/helpers/utils";
import { validateRegisterData } from "../../middlewares/auth/validateRegisterData";
import UserController from "../../controllers/user/UserController";


const userRouter: IRouter = express.Router();

userRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await UserController.loginUser(email, password);
  
  if(result.status !== 200){
    res.render("login", { message: result.message });
  }

  (req.session as any).user = {
    first_name: result.userFinded?.first_name,
    last_name: result.userFinded?.last_name,
    role: result.userFinded?.role,
    email,
  };
  return res.redirect("/api/products?limit=2&page=1");
});

userRouter.post("/register", validateRegisterData, async (req: Request, res: Response) => {
  const { body } = req;
  const user: UserModel = {
    ...body,
    role: "USER",
    password: hashPass(body?.password),
  };
  
  const result = await UserController.registerUser(user);
  
  if(result.status !== 201){
    return res.render("register", { message: result.message});
  }
  
  (req.session as any).user = {
    first_name: user?.first_name,
    last_name: user?.last_name,
    role: user?.role,
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
