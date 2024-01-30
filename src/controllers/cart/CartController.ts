import ProductsDao from "../../dao/products/ProductsDao";
import { ProductModel } from "../../services/interfaces/ProductInterface";
import { CartModel } from "../../services/interfaces/CartInterface";
import CartDao from "../../dao/cart/CartDao";
import NotFoundException from "../../services/errors/NotFoundException";
import BadRequestException from "../../services/errors/BadRequestException";

class CartController {
  static async getCart(cid: string) {
    let populated_cart;
    const cart: CartModel | any = await CartDao.get({ _id: cid });

    if (!cart) {
      throw new NotFoundException(
        "The cart you trying to add a product doesn't exists."
      );
    }

    populated_cart = cart.populate({
      path: "products.pid",
      model: "Product",
      select: "title description category thumbnail price stock",
    });
    return populated_cart;
  }

  static async createCart() {
    const cart: CartModel | any = await CartDao.create();

    if (!cart) {
      throw new BadRequestException(
        "The cart creation encountered an error."
      );
    }

    return {
      message: "Cart created successfully.",
      cid: cart._id,
    };
  }

  static async addProduct(cid: string, pid: string) {
    const products: Array<ProductModel> | any = await ProductsDao.get();

    const productFinded = products?.find(
      (product: ProductModel) => product._id === pid
    );

    if (productFinded === undefined) {
      throw new NotFoundException(
        "The product you are trying to add does not exist in the database."
      );
    }
    const cart = await CartDao.get({ _id: cid, "products.pid": pid });

    if (cart) {
      await CartDao.update(
        { _id: cid, "products.pid": pid },
        { $inc: { "products.$.quantity": 1 } }
      );
    } else {
      await CartDao.update(
        { _id: cid },
        { $push: { products: { pid, quantity: 1 } } }
      );
    }

    return { message: `Product has added to cart ${cid}.` };
  }

  static async updateQuantity(cid: string, _pid: string, quantity: number) {
    const cart: CartModel | null = await CartDao.get({ _id: cid });

    const res = await CartDao.update(
      { _id: cid, "products.pid": _pid },
      { $set: { "products.$.quantity": quantity } }
    );

    if (res.modifiedCount === 0) {
      throw new NotFoundException(
        "There is no product or cart to update the quantity for."
      );
    }

    return { message: "Quantity updated successfully." };
  }

  static async deleteProduct(cid: string, _pid: string) {
    const deleted_product = await CartDao.delete(cid, _pid);
    if (deleted_product.modifiedCount === 0) {
      throw new NotFoundException(
        "The product you want to delete either does not exist or has already been deleted."
      );
    }
    return {
      message: "The product has been deleted from cart.",
    };
  }
}

export default CartController;
