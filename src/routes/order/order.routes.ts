import express, { IRouter, NextFunction, Request, Response } from "express";
import OrderController from "../../controllers/order/OrderController";
import PaymentsService from "../../services/payment/payment.services";
import UserController from "../../controllers/user/UserController";
import { passport_jwt } from "../../services/helpers/auth/passport_function";

const orderRoutes: IRouter = express.Router();

orderRoutes.get(
  "/purchase/:oid",
  passport_jwt,
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
  passport_jwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await OrderController.generateOrder(req);
      res
        .status(201)
        .json({
          message: `Purchase order has been created successfully with id ${response.code}.`,
        });
    } catch (error) {
      next(error);
    }
  }
);

orderRoutes.post(
  "/payments/payment-intents",
  passport_jwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oid } = req.body;
      const result = await OrderController.paymentMethod(oid);

      res.status(200).json({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  }
);

orderRoutes.get("/payment/success/:oid", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oid } = req.params;
    console.log(oid)
    await OrderController.deleteOrder(oid);

    res.send("Payment Success");
  } catch (error) {
    next(error)
  }
});
orderRoutes.get("/payment/cancel", (req: Request, res: Response) => res.send("Payment Cancel"));

export default orderRoutes;
