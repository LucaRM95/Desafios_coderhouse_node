import { NextFunction, Request, Response } from "express";
import User from "../../models/user/user.models";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    $and: [{ email: email }, { password: password }],
  });
  if (!user) {
    return res.render("login", { message: "Correo o contraseña invalidos." });
  }
  
  next();
};

export default login;