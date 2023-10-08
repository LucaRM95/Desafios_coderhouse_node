import express, { IRouter, Request, Response } from "express";
import CartManager from "../../classes/cart/CartManager";

const cartRouter: IRouter = express.Router();
const cartManager = new CartManager();

cartRouter.get("/:cid", async (req: Request, res: Response) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCart(cid)
  if(cart === undefined){
    return res.status(404).json({ message: "No se ha encontrado un carrito con el id proporcionado." })
  }
  res.status(200).json(cart);
});

cartRouter.post("/", async (req: Request, res: Response) => {
  const message = await cartManager.createCart();
  res.status(201).json(message);
});

cartRouter.post("/product", async (req: Request, res: Response) => {
  const { cid, pid } = req.body;
  const rta = await cartManager.addProduct(cid, pid);
  
  res.status(200).json(rta);
})

export default cartRouter;
