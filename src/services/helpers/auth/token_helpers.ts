import jwt from "jsonwebtoken";
import env from "../../config/dotenv.config"
import { UserModel } from "../../interfaces/UserInterface";


const JWT_SECRET: string = env.JWT_SECRET || "";

export const tokenGenerator = (user: UserModel) => {
  const { _id, first_name, last_name, email }: UserModel = user;
  const payload = {
    id: _id,
    first_name,
    last_name,
    email,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
};

export const verifyToken = (token: any) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error: any, payload: any) => {
      if (error) {
        return reject(error);
      }
      resolve(payload);
    });
  });
};