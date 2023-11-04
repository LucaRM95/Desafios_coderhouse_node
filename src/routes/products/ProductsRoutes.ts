import express, { IRouter, Request, Response } from "express";
import ProductsManager from "../../classes/products/ProductsManager";
import { ProductModel } from "../../interfaces/ProductModel";
import { v4 as uuidv4 } from "uuid";
import { createValidateProductData } from "../../middlewares/createValidateProductData";
import { updateValidateProductData } from "../../middlewares/updateValidateProductData";

const productManager = new ProductsManager();
const productsRouter: IRouter = express.Router();

productsRouter.get("/products", async (req: Request, res: Response) => {
  const limitParam = req.query.limit;
  const allProducts = await productManager.getProducts();

  if(allProducts.length === 0){
    return res.status(404).json({ message: "No hay productos en la base de datos." })
  }
  const limit =
    typeof limitParam === "string"
      ? parseInt(limitParam, 10) || allProducts.length
      : allProducts.length;

  const limitedProducts = allProducts.slice(0, limit);

  res.status(200).json(limitedProducts);
});

productsRouter.get("/product/:pid", async (req: Request, res: Response) => {
  const pid = req.params.pid;
  
  try{
    const query_res = await productManager.getProductByID(pid);
    if(query_res === null) {
      return res.status(404).json({ message: `El producto con id ${pid} no existe en la base de datos`});
    }
    return res.json(query_res);
  }catch(err){
    return res.status(500).json({ message: "Error al obtener el producto" });
  }
});

productsRouter.post("/product", createValidateProductData, async (req: Request, res: Response) => {
  const {
    code,
    title,
    description,
    category,
    price,
    thumbnail = [],
    stock = 0,
  }: ProductModel = req.body;
  
  const newProduct = {
    _id: uuidv4(),
    code,
    status: true,
    title,
    category,
    thumbnail,
    description,
    price,
    stock,
  };
  productManager.addProduct(newProduct);
  res.status(201).json({ message: "Producto agregado correctamente.", newProduct});
});

productsRouter.put("/product/:pid", updateValidateProductData, async (req: Request, res: Response) => {
  const body: ProductModel = req.body;
  const { title, description, price, stock, thumbnail } = body;
  let { code } = req.body;
  const pid = req.params.pid;

  const newProduct = {
    ...body,
    title, 
    description, 
    price, 
    stock, 
    thumbnail, 
    code
  };

  try{
    const query_res = await productManager.updateProduct(pid, newProduct);
    if(query_res === null) {
      return res.status(404).json({ message: `El producto con id ${pid} no existe en la base de datos`});
    }
    return res.status(200).json({ message: "Producto actualizado corretamente." });
  }catch(err){
    return res.status(500).json({ message: "Ocurrió un error al intentar actualizar el producto." })
  }
});

productsRouter.delete("/product/:pid", async (req: Request, res: Response) => {
  const id: string | number = req.params.pid;

  if (!id) {
    return res
      .status(400)
      .json({ messsage: "Es necesario el id para eliminar un producto." });
  }

  const rta = await productManager.deleteProduct(id);
  if (rta !== 1) {
    return res
      .status(404)
      .json({
        message: "El producto que desea eliminar no se encuentra en la base de datos",
      });
  }
  return res
    .status(200)
    .json({ message: "El producto fue eliminado existosamente." });
});

export = productsRouter;