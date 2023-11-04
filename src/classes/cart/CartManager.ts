import { writeFile, readFile } from "fs/promises";
import { CartModel, CartProduct } from "../../interfaces/CartModel";
import { v4 as uuid } from "uuid";
import ProductsManager from "../products/ProductsManager";
import Cart from "../../models/cart/Carts";

const productManager = new ProductsManager();

class CartManager {
  async getCart(cid: string) {
    const res = Cart.findById({ _id: cid });

    return res;
  }

  async createCart() {
    await Cart.insertMany({ _id: uuid(), products: [] });

    return { message: "Carrito creado correctamente" };
  }

  async addProduct(cid: string, pid: string) {
    const products = await productManager.getProducts();
    const productFinded = products.find((product) => product._id === pid);

    if (productFinded === undefined) {
      return {
        message:
          "El producto que intentas agregar no existe en la base de datos.",
      };
    }

    const cart = await Cart.findOne({ _id: cid, "products.pid": pid });

    if (cart) {
      // Si el producto ya existe en el carrito, incrementa la cantidad
      return await Cart.updateOne(
        { _id: cid, "products.pid": pid },
        { $inc: { "products.$.quantity": 1 } }
      );
    } else {
      // Si el producto no existe en el carrito, agrégalo
      return await Cart.updateOne(
        { _id: cid },
        { $push: {products: { pid, quantity: 1 }} }
      );
    }
  }
}

export default CartManager;
