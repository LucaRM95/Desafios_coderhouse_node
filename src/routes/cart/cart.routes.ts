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
  passport_jwt,
  cartExist,
  user_cart,
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const cid = req.params.cid;
    try {
      const query_res: any = await CartController.getCart(cid);

      if (query_res === null) {
        return res
          .status(404)
          .json({ message: "The cart you trying to find doesn't exists." });
      }

      res.status(200).json({
        status: 200,
        payload: query_res,
      });
    } catch (error) {
      console.error("Error in cartRouter:", error);
      res.status(500).json({ message: "Server internal error." });
    }
  }
);

cartRouter.post(
  "/",
  passport_jwt,
  async (req: Request, res: Response) => {
    const { _id }: any = req.user

    const result = await CartController.createCart();
    const updateUser = await UserController.findAndAsociateCart( _id, result.cid );
    
    if(updateUser.status !== 200){
      return res.status(400).json({ status: 400, message: "Ocurrió un error al intentar asociar al usuario con el carrito." });
    }

    return res.status(201).json({ status: result.status, message: result.message });
  }
);

cartRouter.post(
  "/product",
  passport_jwt,
  cartExist,
  async (req: Request, res: Response) => {
    const { cid, pid } = req.body;
    await CartController.addProduct(cid, pid);

    return res
      .status(200)
      .json({ message: `Product has added to cart ${cid}.` });
  }
);

cartRouter.put(
  "/products",
  passport.authenticate('jwt', { session: false }),
  cartExist,
  async (req: Request, res: Response) => {
    const { cid, pid, quantity } = req.body;
    const response = await CartController.updateQuantity(cid, pid, quantity);

    return res
      .status(response?.status || 200)
      .json({ message: response?.message });
  }
);

cartRouter.put(
  "/:cid",
  passport_jwt,
  cartExist,
  async (req: Request, res: Response) => {
    const cid = req.params.cid;
    const products = req.body;
    const response = await CartController.updateProducts(cid, products);

    return res
      .status(response?.status || 200)
      .json({ message: response?.message });
  }
);

cartRouter.delete(
  "/products",
  passport_jwt,
  cartExist,
  async (req: Request, res: Response) => {
    const { cid, pid } = req.body;
    const cart = await CartController.deleteProduct(cid, pid);

    return res.status(200).json(cart);
  }
);

export default cartRouter;
