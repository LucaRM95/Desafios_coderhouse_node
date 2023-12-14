import { Request, Response, NextFunction } from "express";
import ProductsController from "../../controllers/products/ProductsController";
import { ProductModel } from "../../services/interfaces/ProductInterface";

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
