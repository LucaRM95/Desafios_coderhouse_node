import express, { IRouter, NextFunction, Request, Response } from "express";
import SessionController from "../../controllers/session/SessionController";

const sessionRouter: IRouter = express.Router();

sessionRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await SessionController.currentSession(req);
  
    return res.status(200).json(session);
  } catch (error) {
    next(error);
  }  
});

sessionRouter.get("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logout_res = await SessionController.logoutSession(req, res);
  
    return res.status(200).json(logout_res);
  } catch (error) {
    next(error);
  }
});

export default sessionRouter;
