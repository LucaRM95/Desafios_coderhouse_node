import express, { IRouter, Request, Response } from "express";
import CartManager from "../../classes/cart/CartManager";
import { cartExist } from "../../middlewares/cartExist";

const cartRouter: IRouter = express.Router();
const cartManager = new CartManager();

cartRouter.get("/:cid", cartExist, async (req: Request, res: Response) => {
  const cid = req.params.cid;
  const query_res = await cartManager.getCart(cid);

  if(query_res === null){
    return res.status(404).json({ message: "El carrito que intentas buscar no existe." });
  }

  res.status(200).json(query_res);
});

cartRouter.post("/", async (req: Request, res: Response) => {
  const message = await cartManager.createCart();
  res.status(201).json(message);
});

cartRouter.post("/product", cartExist, async (req: Request, res: Response) => {
  const { cid, pid } = req.body;
  const query_res = await cartManager.addProduct(cid, pid);

  res.status(200).json({ message: `Producto agregado al carrito ${cid}` });
})

export default cartRouter;
