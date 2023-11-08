import { Request, Response, NextFunction } from "express";
import ProductsManager from "../../classes/products/ProductsManager";
import { ProductModel } from "../../interfaces/ProductModel";

const productManager = new ProductsManager();

// Middleware de validación de datos del producto
export const updateValidateProductData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id, code }: ProductModel =
    req.body;

  if (_id !== undefined) {
    return res
      .status(400)
      .json({ message: "El campo id no se puede modificar." });
  }

  const exists = await productManager.getProductByID(code);

  if (code !== exists?.code) {
    return res
      .status(400)
      .json({ message: "El campo código no se puede modificar." });
  }

  next();
};
