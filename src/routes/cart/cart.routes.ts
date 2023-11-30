import passport from "passport";
import { cartExist } from "../../middlewares/cart/cartExist";
import express, { IRouter, Request, Response } from "express";
import CartController from "../../controllers/cart/CartController";

const cartRouter: IRouter = express.Router();
const cartController = new CartController();

cartRouter.get(
  "/:cid",
  cartExist,
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const cid = req.params.cid;
    try {
      const query_res: any = await cartController.getCart(cid);

      if (query_res === null) {
        return res
          .status(404)
          .json({ message: "The cart you trying to find doesn't exists." });
      }

      res.render("cart", {
        payload: query_res.products.map((d: any) => d.toJSON()),
      });
    } catch (error) {
      console.error("Error in cartRouter:", error);
      res.status(500).json({ message: "Server internal error." });
    }
  }
);

cartRouter.post(
  "/",
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const message = await cartController.createCart();
    return res.status(201).json(message);
  }
);

cartRouter.post(
  "/product",
  passport.authenticate('jwt', { session: false }),
  cartExist,
  async (req: Request, res: Response) => {
    const { cid, pid } = req.body;
    await cartController.addProduct(cid, pid);

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
    const response = await cartController.updateQuantity(cid, pid, quantity);

    return res
      .status(response?.status || 200)
      .json({ message: response?.message });
  }
);

cartRouter.put(
  "/:cid",
  passport.authenticate('jwt', { session: false }),
  cartExist,
  async (req: Request, res: Response) => {
    const cid = req.params.cid;
    const products = req.body;
    const response = await cartController.updateProducts(cid, products);

    return res
      .status(response?.status || 200)
      .json({ message: response?.message });
  }
);

cartRouter.delete(
  "/products",
  passport.authenticate('jwt', { session: false }),
  cartExist,
  async (req: Request, res: Response) => {
    const { cid, pid } = req.body;
    const cart = await cartController.deleteProduct(cid, pid);

    return res.status(200).json(cart);
  }
);

export default cartRouter;
