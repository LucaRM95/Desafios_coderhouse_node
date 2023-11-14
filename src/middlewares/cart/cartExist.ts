import { Request, Response, NextFunction } from "express";
import CartManager from "../../classes/cart/CartManager";

const cartManager = new CartManager();

export const cartExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let cart: any;
  const { cid } = req.body;
  const param_cid = req.params.cid;

  if (cid === undefined) {
    cart = await cartManager.getCart(param_cid);
  } else {
    cart = await cartManager.getCart(cid);
  }

  if (cart === null || cart === undefined) {
    return res.status(404).json({
      message: "No se ha encontrado un carrito con el id proporcionado.",
    });
  }

  next();
};
