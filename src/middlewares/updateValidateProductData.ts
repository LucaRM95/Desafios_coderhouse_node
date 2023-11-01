import { Request, Response, NextFunction } from "express";
import ProductsManager from "../dao/products/ProductsManager";
import { ProductModel } from "../interfaces/ProductModel";

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

  if (code !== undefined) {
    return res
      .status(400)
      .json({ message: "El campo código no se puede modificar." });
  }

  next();
};
