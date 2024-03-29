import { Request, Response, NextFunction } from "express";
import ProductsController from "../../controllers/products/ProductsController";
import { ProductModel } from "../../services/interfaces/ProductInterface";

// Middleware de validación de datos del producto
export  const createValidateProductData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products: any = await ProductsController.getProducts();
  const { code, title, description, price, stock, category } = req.body;
  
  const isCodeExists = products?.newProductsResponse?.payload.find((product: ProductModel) => product.code === code)
    ? true
    : false;

  if (code === 0 || isCodeExists) {
    return res
      .status(400)
      .json({
        message:
          "El campo código es obligatorio o ya existe un producto con el mismo código.",
      });
  }

  if (!code || code === 0) {
    return res.status(400).json({ message: "El campo código es obligatorio." });
  }

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "El campo título es obligatorio." });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "El campo descripción es obligatorio." });
  }

  if (!category || category.trim() === "") {
    return res.status(400).json({ message: "El campo de categoria es obligatorio." });
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
}
