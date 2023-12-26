import { v4 as uuid } from "uuid";
import Order from "../../models/order/order.model";

class OrderDao {
  static get(oid: string | number) {
    return Order.findOne({ 
        $or: [
            { _id: { $eq: oid } }, 
            { code: { $eq: oid } }
        ] 
    }).exec();
  }

  static create(email: string, amount: Number) {
    return Order.create({
      _id: uuid(),
      code: Math.floor(Math.random() * 99999999),
      amount: amount,
      purchaser: email
    });
  }

  static delete(oid: string) {
    return Order.deleteOne({ _id: oid });
  }
}

export default OrderDao;