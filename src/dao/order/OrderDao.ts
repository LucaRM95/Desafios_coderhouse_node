import Order from "../../models/order/order.model";

class OrderDao {
  static get(oid: string | number) {
    return Order.findOne({
      $or: [{ _id: { $eq: oid } }, { code: { $eq: oid } }],
    }).exec();
  }

  static create(order: any) {
    return Order.create(order);
  }

  static delete(oid: string) {
    return Order.deleteOne({
      $or: [{ _id: { $eq: oid } }, { code: { $eq: oid } }],
    });
  }
}

export default OrderDao;
