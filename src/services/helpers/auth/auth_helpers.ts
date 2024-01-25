import path from "path";
import bycrypt from "bcrypt";
import { UserModel } from "../../interfaces/UserInterface";

export const __dirname = path.resolve();

export const hashPass = (pass: string) =>
  bycrypt.hashSync(pass, bycrypt.genSaltSync(10));

export const validatePass = (pass: string, user: UserModel) =>
  bycrypt.compareSync(pass, user.password);
