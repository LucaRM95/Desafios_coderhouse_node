import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../interfaces/UserInterface";

export const authPolicies = (roles: Array<string>, action: string = "add") => (req : Request, res: Response,  next: NextFunction) => {
    if (roles.includes('USER')) {
      return next();
    }
    const { role }: UserModel | any = req.user;
    if (!roles.includes(role)) {
      return res.status(403).json({ message: `Sorry, you don't have authorization to ${action} a product.` });
    }
    next();
  }