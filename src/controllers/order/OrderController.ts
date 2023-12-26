import OrderDao from "../../dao/order/OrderDao";
import NotFoundException from "../../services/errors/NotFoundException";

class OrderController {
  static generateOrder(email: string, amount: Number) {
    return OrderDao.create(email, amount);
  }

  static async getOrder(oid: string) {
    const order = await OrderDao.get(oid);

    if (!order) {
      throw new NotFoundException(`The order with id ${oid} doesn't exists.`);
    }

    return order;
  }

  static async deleteOrder(oid: string) {
    const orderToDeleteFinded = OrderDao.get(oid);

    if (!orderToDeleteFinded) {
      throw new NotFoundException(
        "The order you trying to delete doesn't exists."
      );
    }

    return OrderDao.delete(oid);
  }
}

export default OrderController;