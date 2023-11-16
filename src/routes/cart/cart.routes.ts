import express, { IRouter, Request, Response } from "express";
import CartController from "../../controllers/cart/CartController";
import { cartExist } from "../../middlewares/cart/cartExist";
import { privateRouter } from "../../middlewares/auth/privateRoutes";

const cartRouter: IRouter = express.Router();
const cartController = new CartController();

cartRouter.get("/:cid", cartExist, privateRouter, async (req: Request, res: Response) => {
  const cid = req.params.cid;
  try {
    const query_res: any = await cartController.getCart(cid);

    if (query_res === null) {
      return res.status(404).json({ message: "El carrito que intentas buscar no existe." });
    }

    res.render('cart', { payload: query_res.products.map((d: any) => d.toJSON()) });
  } catch (error) {
    console.error("Error in cartRouter:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

cartRouter.post("/", async (req: Request, res: Response) => {
  const message = await cartController.createCart();
  return res.status(201).json(message);
});

cartRouter.post("/product", cartExist, async (req: Request, res: Response) => {
  const { cid, pid } = req.body;
  await cartController.addProduct(cid, pid);

  return res.status(200).json({ message: `Producto agregado al carrito ${cid}` });
})

cartRouter.put("/products", cartExist, async ( req: Request, res: Response) => {
  const { cid, pid, quantity } = req.body;
  const response = await cartController.updateQuantity(cid, pid, quantity);

  return res.status(response?.status || 200).json({ message: response?.message });
});

cartRouter.put("/:cid", cartExist, async ( req: Request, res: Response ) => {
  const cid = req.params.cid;
  const products = req.body;
  const response = await cartController.updateProducts(cid, products);

  return res.status(response?.status || 200).json({message: response?.message});
});


cartRouter.delete("/products", cartExist, async ( req: Request, res: Response ) => {
  const { cid, pid } = req.body;
  const cart = await cartController.deleteProduct(cid, pid);

  return res.status(200).json(cart);
});

export default cartRouter;
