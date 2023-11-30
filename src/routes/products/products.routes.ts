import passport from "passport";
import { v4 as uuidv4 } from "uuid";
import express, { IRouter, Request, Response } from "express";
import { authPolicies } from "../../services/helpers/auth/auth_policies";
import { ProductModel } from "../../services/interfaces/ProductInterface";
import ProductsController from "../../controllers/products/ProductsController";
import { createValidateProductData } from "../../middlewares/product/createValidateProductData";
import { updateValidateProductData } from "../../middlewares/product/updateValidateProductData";

const productController = new ProductsController();
const productsRouter: IRouter = express.Router();

productsRouter.get(
  "/products",
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const { limit, page, sort, criteria } = req.query;

    const allProducts = await productController.getProducts(
      limit,
      page,
      sort,
      criteria
    );

    if (allProducts?.payload.length === 0) {
      return res
        .status(404)
        .json({ message: "Doesn't exists products in database." });
    }
    res.status(200).json(allProducts);
  }
);

productsRouter.get(
  "/product/:pid",
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const pid = req.params.pid;

    try {
      const query_res = await productController.getProductByID(pid);
      if (query_res === null) {
        return res.status(404).json({
          message: `The product with id ${pid} doesn't exists in the database.`,
        });
      }
      res.status(200).json(query_res);
    } catch (err) {
      return res.status(500).json({ message: "Error trying to obtain one product." });
    }
  }
);

productsRouter.post(
  "/product",
  passport.authenticate('jwt', { session: false }),
  authPolicies(["ADMIN"], "add"),
  createValidateProductData,
  async (req: Request, res: Response) => {
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
    productController.addProduct(newProduct);
    res
      .status(201)
      .json({ message: "Product has been added successfully.", newProduct });
  }
);

productsRouter.put(
  "/product/:pid",
  passport.authenticate('jwt', { session: false }),
  authPolicies(["ADMIN"], "edit"),
  updateValidateProductData,
  async (req: Request, res: Response) => {
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
      code,
    };

    try {
      const query_res = await productController.updateProduct(pid, newProduct);
      if (query_res === null) {
        return res.status(404).json({
          message: `The product with id ${pid} doesn't exists in database.`,
        });
      }
      return res
        .status(200)
        .json({ message: "Product has been updated successfully." });
    } catch (err) {
      return res.status(500).json({
        message: "An error occurred to try update one product.",
      });
    }
  }
);

productsRouter.delete(
  "/product/:pid",
  passport.authenticate('jwt', { session: false }),
  authPolicies(["ADMIN"], "delete"),
  async (req: Request, res: Response) => {
    const id: string | number = req.params.pid;

    if (!id) {
      return res
        .status(400)
        .json({ messsage: "The id is necessary to delete the product." });
    }

    const rta = await productController.deleteProduct(id);
    if (rta !== 1) {
      return res.status(404).json({
        message:
          "The product to trying to delete doesn't exists in database.",
      });
    }
    return res
      .status(200)
      .json({ message: "The product was deleted successfully." });
  }
);

export = productsRouter;
