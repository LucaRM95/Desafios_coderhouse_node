import express, { IRouter, Request, Response } from "express";
import { UserModel } from "../../services/interfaces/UserInterface";
import { hashPass, tokenGenerator } from "../../services/helpers/utils";
import { validateRegisterData } from "../../middlewares/auth/validateRegisterData";
import UserController from "../../controllers/user/UserController";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";

const userRouter: IRouter = express.Router();

userRouter.post("/login", passport.authenticate('login', { failureRedirect: '/login' }), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await UserController.loginUser(email, password);

  if (result.status !== 200) {
    return res.render("login", { message: result.message });
  }

  (req.session as any).user = {
    first_name: result.userFinded?.first_name,
    last_name: result.userFinded?.last_name,
    role: result.userFinded?.role,
    email,
  };

  const token = tokenGenerator(result.userFinded);

  return res
    .cookie("access_token", token, {
      maxAge: 60000,
      httpOnly: true,
    })
    .redirect("/api/products?limit=2&page=1");
});

userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

userRouter.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  (req.session as any).user = req.user;
  res.redirect('/api/products?limit=2&page=1');
})

userRouter.post(
  "/register",
  passport.authenticate('register', { failureRedirect: '/register' }),
  async (req: Request, res: Response) => {
    const { body } = req;
    const user: UserModel = {
      ...body,
      _id: uuidv4(),
      role: "USER",
      password: hashPass(body?.password),
    };

    const result = await UserController.registerUser(user);

    if (result.status !== 201) {
      return res.render("register", { message: result.message });
    }

    (req.session as any).user = {
      first_name: user?.first_name,
      last_name: user?.last_name,
      role: user?.role,
      email: user?.email,
    };

    const token = tokenGenerator((req.session as any).user);

    return res
      .cookie("access_token", token, {
        maxAge: 60000,
        httpOnly: true,
      })
      .redirect("/api/products?limit=2&page=1");
  }
);

userRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    return res.redirect("/login");
  });
});

export default userRouter;
