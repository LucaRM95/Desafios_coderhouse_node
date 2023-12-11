import express, { IRouter, Request, Response } from "express";
import coookieExtractor from "../../services/helpers/cookies/cookieExtractor";
import { verifyToken } from "../../services/helpers/auth/token_helpers";
import SessionController from "../../controllers/session/SessionController";

const sessionRouter: IRouter = express.Router();

sessionRouter.get("/", async (req: Request, res: Response) => {
  const session = await SessionController.currentSession(req);

  return res.status(session?.status).json(session);
});

sessionRouter.get("/logout", async (req: Request, res: Response) => {
  const logout_res = await SessionController.logoutSession(req, res);

  return res.status(logout_res?.status).json(logout_res);
});

export default sessionRouter;
