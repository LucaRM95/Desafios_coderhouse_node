import { v4 as uuid } from "uuid";
import Cart from "../../models/cart/cart.models";

class CartDao {
  static get(filter_query: any = {}, criteria: any = {}) {
    return Cart.findOne(filter_query, criteria).exec();
  }

  static create() {
    return Cart.create({
      _id: uuid(),
      products: [],
    });
  }

  static update(filter_query: any, criteria: any) {
    return Cart.updateOne(filter_query, criteria);
  }

  static delete(cid: string, _pid: string) {
    return Cart.updateOne(
      { _id: cid },
      { $pull: { products: { pid: _pid } } }
    );
  }
}

export default CartDao;
