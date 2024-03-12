import { Request } from "express";
import { v4 as uuid } from "uuid";
import OrderDao from "../../dao/order/OrderDao";
import NotFoundException from "../../services/errors/NotFoundException";
import SessionController from "../session/SessionController";
import CartController from "../cart/CartController";
import ProductsDao from "../../dao/products/ProductsDao";
import ConflictException from "../../services/errors/ConflictException";
import UserController from "../user/UserController";
import PaymentsService from "../../services/payment/payment.services";
import env from "../../services/config/dotenv.config"

interface PaymentProduct {
  id: number;
  title: string;
  description: string;
  unit_amount: number;
  quantity: number;
}

interface ProductArray {
  pid: {
    _id: string;
    title: string;
    description: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  amount: number;
  purchaser: string;
  products?: ProductArray[];
}

class OrderController {
  static async generateOrder(req: Request) {
    const user: any = await SessionController.currentSession(req);
    const { products }: any = await CartController.getCart(user.cid);

    if (products.length === 0) {
      throw new NotFoundException(
        "You don't have products in the cart to generate a purchase order."
      );
    }

    for (const { pid, quantity } of products) {
      if (pid.stock < quantity) {
        throw new ConflictException(
          `The product ${pid.title} haven't enough stock.`
        );
      }
      await ProductsDao.update(
        { _id: pid._id },
        { $inc: { stock: -quantity } }
      );
    }

    const newOrder = {
      _id: uuid(),
      code: this.generateOrderCode(),
      amount: products.reduce((acc: number, p: any) => {
        return acc + p.pid.price * p.quantity;
      }, 0),
      products: products.map((p: ProductArray) => {
        return {
          pid: p.pid._id,
          title: p.pid.title,
          description: p.pid.description,
          unit_amount: p.pid.price,
          quantity: p.quantity,
        };
      }),
      purchaser: user.email,
    };

    await CartController.deleteProduct(
      user.cid,
      products.map(({ pid }: any) => pid._id)
    );
    return OrderDao.create(newOrder);
  }

  static async getOrder(oid: string) {
    const order = await OrderDao.get(oid);

    if (!order) {
      throw new NotFoundException(`The order with id ${oid} doesn't exists.`);
    }

    return order;
  }

  static async paymentMethod(oid: string) {
    const order: Order | any = await OrderController.getOrder(oid);
    const users = await UserController.getUsers();
    const user = users.find((u: any) => u.email === order?.purchaser);

    if (!order.products) {
      throw new NotFoundException("product not found.");
    }

    const paymentIntentInfo = {
      line_items: order.products.map((product: PaymentProduct) => {
        return {
          price_data: {
            product_data: {
              name: product.title,
              description: product.description,
            },
            currency: "usd",
            unit_amount: product.unit_amount * 100,
          },
          quantity: product.quantity,
        };
      }),
      mode: "payment",
      success_url: `${env.URL}api/order/payment/success/${oid}`,
      cancel_url: `${env.URL}api/order/payment/cancel`,
    };

    const service = new PaymentsService();
    const result = await service.createPaymentIntent(paymentIntentInfo);

    return result;
  }

  static async deleteOrder(oid: string) {
    const orderToDeleteFinded = await OrderDao.get(oid);

    if (!orderToDeleteFinded) {
      throw new NotFoundException(
        "The order you are trying to delete doesn't exist."
      );
    }

    return OrderDao.delete(oid);
  }

  private static generateOrderCode(): string {
    return Math.floor(Math.random() * 99999999).toString();
  }
}

export default OrderController;
