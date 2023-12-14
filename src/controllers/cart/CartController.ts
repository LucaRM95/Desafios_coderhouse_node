import { v4 as uuid } from "uuid";
import ProductsDao from "../../dao/products/ProductsDao";
import Cart from "../../models/cart/carts.model";
import { ProductModel } from "../../services/interfaces/ProductInterface";
import { CartModel } from "../../services/interfaces/CartInterface";
import CartDao from "../../dao/cart/CartDao";

class CartController {
  static async getCart(cid: string) {
    try {
      let populated_cart;
      const cart: CartModel | any = await CartDao.get({ _id: cid });

      if (cart) {
        populated_cart = cart.populate({
          path: "products.pid",
          model: "Product",
          select: "title description category thumbnail price",
        });
        return populated_cart;
      }

      return cart;
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error.message}.`);
    }
  }

  static async createCart() {
    try {
      const cart: CartModel | any = await CartDao.create();

      if (!cart) {
        return {
          status: 400,
          message: "Ocurrió un error al intentar crear el carrito.",
        };
      }

      return {
        status: 201,
        message: "Carrito creado correctamente",
        cid: cart._id,
      };
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async addProduct(cid: string, pid: string) {
    try {
      const products: Array<ProductModel> | any = await ProductsDao.get();

      const productFinded = products?.find(
        (product: ProductModel) => product._id === pid
      );

      if (productFinded === undefined) {
        return {
          status: 404,
          message:
            "El producto que intentas agregar no existe en la base de datos.",
        };
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

      return { status: 200, message: `Product has added to cart ${cid}.` };
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async updateQuantity(cid: string, _pid: string, quantity: number) {
    try {
      const cart: CartModel | null = await CartDao.get({ _id: cid });

      const res = await CartDao.update(
        { _id: cid, "products.pid": _pid },
        { $set: { "products.$.quantity": quantity } }
      );

      if (res.modifiedCount === 0) {
        return {
          status: 404,
          message: "No existe producto o carrito para actualizar la cantidad.",
        };
      }

      return { status: 200, message: "Cantidad actualizada correctamente." };
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async deleteProduct(cid: string, _pid: string) {
    try {
      const deleted_product = await CartDao.delete(cid, _pid);
      if (deleted_product.modifiedCount === 0) {
        return {
          status: 404,
          message:
            "El producto que deseas eliminar no existe o ya fue eliminado.",
        };
      }
      return {
        status: 200,
        message: "Se ha eliminado el producto del carrito.",
      };
    } catch (error: any) {
      throw new Error(`Server Internal Error: ${error?.message}.`);
    }
  }
}

export default CartController;
