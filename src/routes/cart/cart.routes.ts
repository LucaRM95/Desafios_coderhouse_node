import passport from "passport";
import { cartExist } from "../../middlewares/cart/cartExist";
import express, { IRouter, Request, Response } from "express";
import CartController from "../../controllers/cart/CartController";
import { passport_jwt } from "../../services/helpers/auth/passport_function";
import UserController from "../../controllers/user/UserController";
import { user_cart } from "../../middlewares/cart/user_cart";

const cartRouter: IRouter = express.Router();

cartRouter.get(
  "/:cid",
  user_cart,
  cartExist,
  async (req: Request, res: Response) => {
    const cid = req.params.cid;
    try {
      const query_res: any = await CartController.getCart(cid);

      res.status(200).json({
        status: 200,
        payload: query_res,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Server Internal Error: ${error?.message}.` });
    }
  }
);

cartRouter.post("/", async (req: Request, res: Response) => {
  const result = await CartController.createCart();
  
  return res
    .status(201)
    .json({ status: result.status, message: result.message });
});

cartRouter.post(
  "/product",
  user_cart,
  cartExist,
  async (req: Request, res: Response) => {
    const { cid, pid } = req.body;
    const result: any = await CartController.addProduct(cid, pid);

    return res
      .status(result?.status)
      .json({ message: result?.message });
  }
);

cartRouter.put(
  "/products",
  user_cart,
  cartExist,
  async (req: Request, res: Response) => {
    const { cid, pid, quantity } = req.body;
    const response: any = await CartController.updateQuantity(cid, pid, quantity);

    return res
      .status(response?.status)
      .json({ message: response?.message });
  }
);

cartRouter.put(
  "/:cid",
  user_cart,
  cartExist,
  async (req: Request, res: Response) => {
    const cid = req.params.cid;
    const products = req.body;
    const response: any = await CartController.updateProducts(cid, products);

    return res
      .status(response?.status)
      .json({ message: response?.message });
  }
);

cartRouter.delete(
  "/products",
  user_cart,
  cartExist,
  async (req: Request, res: Response) => {
    const { cid, pid } = req.body;
    const cart = await CartController.deleteProduct(cid, pid);

    return res.status(cart?.status).json({ message: cart?.message });
  }
);

export default cartRouter;
