import { cartExist } from "../../middlewares/cart/cartExist";
import express, { IRouter, NextFunction, Request, Response } from "express";
import CartController from "../../controllers/cart/CartController";
import { user_cart } from "../../middlewares/cart/user_cart";
import { authPolicies } from "../../services/helpers/auth/auth_policies";

const cartRouter: IRouter = express.Router();

cartRouter.get(
  "/:cid",
  user_cart,
  cartExist,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cid = req.params.cid;
      const query_res: any = await CartController.getCart(cid);

      res.status(200).json({
        payload: query_res,
      });
    } catch (error) {
      next(error);
    }
  }
);

cartRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CartController.createCart();

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

cartRouter.post(
  "/product",
  user_cart,
  cartExist,
  authPolicies(["USER"], "add"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cid, pid } = req.body;
      const result: any = await CartController.addProduct(cid, pid);
  
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

cartRouter.put(
  "/products",
  user_cart,
  cartExist,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cid, pid, quantity } = req.body;
      const response: any = await CartController.updateQuantity(
        cid,
        pid,
        quantity
      );
  
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

cartRouter.delete(
  "/products",
  user_cart,
  cartExist,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cid, pid } = req.body;
      const cart = await CartController.deleteProduct(cid, pid);
  
      return res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }
);

export default cartRouter;
