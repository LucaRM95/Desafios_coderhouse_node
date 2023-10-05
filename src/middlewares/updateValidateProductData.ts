import { Request, Response, NextFunction } from "express";
import ProductsManager from "../classes/ProductsManager";
import { ProductModel } from "../interfaces/ProductModel";

const productManager = new ProductsManager();

// Middleware de validación de datos del producto
export const updateValidateProductData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, title, description, price, stock, category }: ProductModel =
    req.body;

  if (id !== undefined) {
    return res
      .status(400)
      .json({ message: "El campo id no se puede modificar." });
  }

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "El campo título es obligatorio." });
  }

  if (!description || description.trim() === "") {
    return res
      .status(400)
      .json({ message: "El campo descripción es obligatorio." });
  }

  if (!category || category.trim() === "") {
    return res
      .status(400)
      .json({ message: "El campo de categoria es obligatorio." });
  }

  if (!stock || isNaN(stock)) {
    return res.status(400).json({
      message: "El campo stock es obligatorio y debe ser un número válido.",
    });
  }

  if (!price || isNaN(price)) {
    return res.status(400).json({
      message: "El campo precio es obligatorio y debe ser un número válido.",
    });
  }

  next();
};
