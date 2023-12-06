import { Request, Response, NextFunction } from "express";
import CartController from "../../controllers/cart/CartController";
import UserController from "../../controllers/user/UserController";
import coookieExtractor from "../../services/helpers/cookies/cookieExtractor";
import { verifyToken } from "../../services/helpers/auth/token_helpers";

export const user_cart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let cart: any;
  let userFinded: any;
  const { cid } = req.body;
  const param_cid = req.params.cid;

  const user_token = coookieExtractor(req);
  const parsed_token: any = await verifyToken(user_token);

  if (cid === undefined) {
    cart = await CartController.getCart(param_cid);
    userFinded = await UserController.findUserByCart(param_cid);
  } else {
    cart = await CartController.getCart(cid);
    userFinded = await UserController.findUserByCart(cid);
  }

  if (parsed_token?.id !== userFinded._id) {
    return res
      .status(404)
      .json({ status: 404, message: "This user don't have any linked cart." });
  }

  if (cart === null || cart === undefined) {
    return res.status(404).json({
      status: 404,
      message: "No se ha encontrado un carrito con el id proporcionado.",
    });
  }

  next();
};
