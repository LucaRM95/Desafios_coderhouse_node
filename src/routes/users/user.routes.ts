import express, { IRouter, Request, Response } from "express";
import User from "../../models/user/user.models";
import { UserModel } from "../../interfaces/UserInterface";
import login from "../../middlewares/auth/login";

const userRouter: IRouter = express.Router();

userRouter.post("/login", login, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: UserModel | null = await User.findOne({
    $and: [{ email: email }, { password: password }],
  });

  (req.session as any).user = {
    first_name: user?.first_name,
    last_name: user?.last_name,
    email,
  };
  return res.redirect("/api/products?limit=2&page=1");
});

userRouter.post("/register", async (req: Request, res: Response) => {
  const { body } = req;
  const newUser = await User.create({ ...body, role: "USER" });
  console.log("newUser", newUser);
  res.redirect("/login");
});

userRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/login");
  });
});

export default userRouter;
