import { Request, Response } from "express";
import coookieExtractor from "../../services/helpers/cookies/cookieExtractor";
import { verifyToken } from "../../services/helpers/auth/token_helpers";
import UnauthorizedException from "../../services/errors/UnauthorizedException";
import BadRequestException from "../../services/errors/BadRequestException";
import UserDao from "../../dao/user/UserDao";
import { UserModel } from "../../services/interfaces/UserInterface";

class SessionController {
  static async currentSession(req: Request) {
    const token = coookieExtractor(req);

    if (!token) {
      throw new UnauthorizedException(
        "Don't exits any session. Please trying to login."
      );
    }

    const current_session = await verifyToken(token);
    return current_session;
  }

  static async logoutSession(req: Request, res: Response) {
    res.clearCookie("access_token");
    const cookie = req.signedCookies;
    const userCookie = await coookieExtractor(req);
    const user: UserModel | any = await verifyToken(userCookie);

    await UserDao.update(
      { _id: user.id },
      { $set: { last_connection: Date.now() } }
    );

    if (!cookie?.access_token) {
      throw new BadRequestException("Doesn't have any cookie to clear.");
    }

    return { message: "Cookie cleared successfully." };
  }
}

export default SessionController;
