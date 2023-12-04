import express, { IRouter, Request, Response } from "express";
import coookieExtractor from "../../services/helpers/cookies/cookieExtractor";
import { verifyToken } from "../../services/helpers/auth/token_helpers";

const sessionRouter: IRouter = express.Router();

sessionRouter.get("/", async (req: Request, res: Response) => {
    const token = coookieExtractor(req);

    if(!token){
        return res.status(404).json({
            status: 200,
            message: "Don't exits any session. Please trying to login."
        });
    }

    const current_session = await verifyToken(token)

    return res.status(200).json({
        status: 200,
        user: current_session
    });
})

export default sessionRouter;