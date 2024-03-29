import express, { IRouter, NextFunction, Request, Response } from "express";
import { authPolicies } from "../../services/helpers/auth/auth_policies";
import { ProductModel } from "../../services/interfaces/ProductInterface";
import { passport_jwt } from "../../services/helpers/auth/passport_function";
import ProductsController from "../../controllers/products/ProductsController";
import { createValidateProductData } from "../../middlewares/product/createValidateProductData";
import { updateValidateProductData } from "../../middlewares/product/updateValidateProductData";
import SessionController from "../../controllers/session/SessionController";

const productsRouter: IRouter = express.Router();

productsRouter.get(
  "/products",
  passport_jwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, page, sort, criteria } = req.query;

      const allProducts = await ProductsController.getProducts(
        limit,
        page,
        sort,
        criteria
      );

      res.status(200).json(allProducts);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get(
  "/product/:pid",
  passport_jwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pid: string | number = req.params.pid;

      const query_res = await ProductsController.getProductByID(pid);

      res.status(200).json(query_res);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.post(
  "/product",
  passport_jwt,
  authPolicies(["ADMIN", "PREMIUM"], "add"),
  createValidateProductData,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = await SessionController.currentSession(req);
    
      await ProductsController.addProduct(req.body, currentUser);
      res.status(201).json({ message: "Product has been added successfully." });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.put(
  "/product/:pid",
  passport_jwt,
  authPolicies(["ADMIN", "PREMIUM"], "edit"),
  updateValidateProductData,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product: ProductModel = req.body;
      const pid: string | number = req.params.pid;

      const query_res = await ProductsController.updateProduct(pid, product);

      return res.status(200).json(query_res);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.delete(
  "/product/:pid",
  passport_jwt,
  authPolicies(["ADMIN", "PREMIUM"], "delete"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string | number = req.params.pid;

      await ProductsController.deleteProduct(id);

      return res
        .status(200)
        .json({ message: "The product was deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
);

export = productsRouter;
