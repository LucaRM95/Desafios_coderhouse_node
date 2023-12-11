import { Request, Response } from "express";
import coookieExtractor from "../../services/helpers/cookies/cookieExtractor";
import { verifyToken } from "../../services/helpers/auth/token_helpers";

class SessionController {
  static async currentSession(req: Request) {
    try {
      const token = coookieExtractor(req);

      if (!token) {
        return {
          status: 401,
          message: "Don't exits any session. Please trying to login.",
        };
      }

      const current_session = await verifyToken(token);
      return { status: 200, current_session };
    } catch (error: any) {
      throw new Error(`Server Internal Error: ${error?.message}.`);
    }
  }

  static async logoutSession(req: Request, res: Response) {
    res.clearCookie("access_token");
    const cookie = req.signedCookies;

    if (!cookie?.access_token) {
      return { status: 400, message: "Doesn't have any cookie to clear." };
    }

    return { status: 200, message: "Cookie cleared successfully." };
  }
}

export default SessionController;
