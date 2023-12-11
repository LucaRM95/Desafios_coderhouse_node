import { Request, Response, NextFunction } from "express";
import coookieExtractor from "../../services/helpers/cookies/cookieExtractor";
import { verifyToken } from "../../services/helpers/auth/token_helpers";

export const user_cart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cid } = req.body;
  const param_cid = req.params.cid;

  const user_token = coookieExtractor(req);
  const parsed_token: any = await verifyToken(user_token);

  if (param_cid && parsed_token.cid !== param_cid) {
    return res.status(401).json({
      message: `The current user don't have a linked cart with id: ${
        cid || param_cid
      }`,
    });
  }

  if (cid && parsed_token.cid !== cid) {
    return res.status(401).json({
      message: `The current user don't have a linked cart with id: ${
        cid || param_cid
      }`,
    });
  }

  next();
};
