import { Request } from "express";
import { v4 as uuid } from "uuid";
import OrderDao from "../../dao/order/OrderDao";
import NotFoundException from "../../services/errors/NotFoundException";
import SessionController from "../session/SessionController";
import CartController from "../cart/CartController";
import ProductsDao from "../../dao/products/ProductsDao";
import ConflictException from "../../services/errors/ConflictException";

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
      if(pid.stock < quantity){
        throw new ConflictException(`The product ${pid.title} haven't enough stock.`);
      }
      await ProductsDao.update(pid._id, { $inc: { stock: -quantity } });
    }

    const newOrder = {
      _id: uuid(),
      code: this.generateOrderCode(),
      amount: products.reduce((acc: number, p: any) => {
        return acc + p.pid.price * p.quantity;
      }, 0),
      products: products.map(({ pid }: any) => pid._id) || [],
      purchaser: user.email,
    };

    await CartController.deleteProduct(user.cid, products.map(({ pid }: any) => pid._id));
    return OrderDao.create(newOrder);
  }

  static async getOrder(oid: string) {
    const order = await OrderDao.get(oid);

    if (!order) {
      throw new NotFoundException(`The order with id ${oid} doesn't exists.`);
    }

    return order;
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
