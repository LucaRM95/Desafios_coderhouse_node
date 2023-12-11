import { v4 as uuid } from "uuid";
import Cart from "../../models/cart/carts.model";
import {
  CartModel,
  CartProduct,
} from "../../services/interfaces/CartInterface";

class CartDao {
  static async getCart(cid: string) {
    try {
      let populatedProducts;
      const res = await Cart.findById(cid).exec();

      if (res) {
        populatedProducts = await Cart.populate(res, {
          path: "products.pid",
          model: "Product",
          select: "title description category thumbnail price",
        });
        return populatedProducts;
      }

      return res;
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async createCart() {
    try {
      const cart: CartModel | any = await Cart.create({
        _id: uuid(),
        products: [],
      });

      return cart;
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async addProduct(cid: string, pid: string) {
    try {
      const cart = await Cart.findOne({ _id: cid, "products.pid": pid });

      if (cart) {
        return await Cart.updateOne(
          { _id: cid, "products.pid": pid },
          { $inc: { "products.$.quantity": 1 } }
        );
      } else {
        return await Cart.updateOne(
          { _id: cid },
          { $push: { products: { pid, quantity: 1 } } }
        );
      }
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async updateQuantity(cid: string, _pid: string, quantity: number) {
    try {
      const cart: CartModel | null = await Cart.findById(cid);

      const result = await Cart.updateOne(
        { _id: cid, "products.pid": _pid },
        { $inc: { "products.$.quantity": quantity } }
      );

      return result;
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async updateProducts(bulkOps: any) {
    try {
      const res = await Cart.bulkWrite(bulkOps);

      return res;
    } catch (error: any) {
      throw new Error(`Server Internal Error: ${error?.message}.`);
    }
  }

  static async deleteProduct(cid: string, _pid: string) {
    try {
      const cart = await Cart.findOne({ _id: cid, "products.pid": _pid });

      const res = await Cart.updateOne(
        { _id: cid },
        { $pull: { products: { pid: _pid } } }
      );

      return res;
    } catch (error: any) {
      throw new Error(`Server Internal Error: ${error?.message}.`);
    }
  }
}

export default CartDao;
