import { Request, Response, NextFunction } from "express";
import CartController from "../../controllers/cart/CartController";

export const cartExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let cart: any;
  const { cid } = req.body;
  const param_cid = req.params.cid;

  if (cid === undefined) {
    cart = await CartController.getCart(param_cid);
  } else {
    cart = await CartController.getCart(cid);
  }
  
  if (cart === null || cart === undefined) {
    return res.status(404).json({
      message: "No se ha encontrado un carrito con el id proporcionado.",
    });
  }

  next();
};
