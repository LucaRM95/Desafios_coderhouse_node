import express, { IRouter, Request, Response } from "express";
import ProductsManager from "../../classes/ProductsManager";
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
  const params = req.params.pid;
  const productId = params;

  try {
    const productById = await productManager.getProductByID(productId);
    res.json(productById);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
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
    id: uuidv4(),
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
  res.status(201).json(newProduct);
});

productsRouter.put("/product/:pid", updateValidateProductData, async (req: Request, res: Response) => {
  const body: ProductModel = req.body;
  const { id, title, description, price, stock, thumbnail } = body;
  let { code } = req.body;
  const pid = req.params.pid;

  const products = await productManager.getProducts();

  const existingProduct = products.find((product: ProductModel) => {
    return product.id === pid;
  });

  if (code === '' || code === undefined) {
    code = existingProduct?.code;
  }

  console.log(code)

  const newProduct = {
    ...body,
    title, 
    description, 
    price, 
    stock, 
    thumbnail, 
    code
  };
  const message = await productManager.updateProduct(pid, newProduct);
  res.status(201).json(message);
});

productsRouter.delete("/product/:pid", async (req: Request, res: Response) => {
  const id: string | number = req.params.pid;

  if (!id) {
    return res
      .status(400)
      .json({ messsage: "Es necesario el id para eliminar un producto." });
  }

  const rta = await productManager.deleteProduct(id);
  if (rta === 1) {
    return res
      .status(404)
      .json({
        message: "No se encuentra el producto con ese id para eliminar",
      });
  }
  return res
    .status(200)
    .json({ message: "El producto fue eliminado existosamente." });
});

export = productsRouter;