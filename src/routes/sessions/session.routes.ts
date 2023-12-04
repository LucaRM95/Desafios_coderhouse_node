import express, { IRouter, Request, Response } from "express";
import coookieExtractor from "../../services/helpers/cookies/cookieExtractor";
import { verifyToken } from "../../services/helpers/auth/token_helpers";

const sessionRouter: IRouter = express.Router();

sessionRouter.get("/", async (req: Request, res: Response) => {
    const token = coookieExtractor(req);
    const current_session = await verifyToken(token)

    console.log(token)
    console.log(current_session)

    return res.status(200).json({
        status: 200,
        user: current_session
    })
})

export default sessionRouter;