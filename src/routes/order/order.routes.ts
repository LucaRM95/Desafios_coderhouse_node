import express, { IRouter, NextFunction, Request, Response } from "express";
import OrderController from "../../controllers/order/OrderController";

const orderRoutes: IRouter = express.Router();

orderRoutes.get(
  "/purchase/:oid",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const oid = req.params.oid;
      const order = await OrderController.getOrder(oid);

      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

orderRoutes.post(
  "/purchase",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await OrderController.generateOrder(req);

      res
        .status(201)
        .json({ message: "Purchase order has been created successfully." });
    } catch (error) {
      next(error);
    }
  }
);

export default orderRoutes;
