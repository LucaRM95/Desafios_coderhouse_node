import { Request, Response, NextFunction } from "express";

export const privateRouter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(req.session as any).user) {
    return res.redirect("/login");
  }
  next();
};

export const publicRouters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req.session as any).user) {
    return res.redirect("api/products");
  }
  next();
};
