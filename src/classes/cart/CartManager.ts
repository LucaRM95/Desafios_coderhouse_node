import { writeFile, readFile } from "fs/promises";
import { CartModel, CartProduct } from "../../models/CartModel";
import { v4 as uuid } from "uuid";
import ProductsManager from "../products/ProductsManager";

const productManager = new ProductsManager();

class CartManager {
  private path: string;
  private cart: Array<CartModel>;

  constructor() {
    this.path = "./db/cart.txt";
    this.cart = [];
  }

  async getCart(cid: string) {
    await this.loadCarts();

    return this.cart.find((cart) => cart.cid === cid);
  }

  async createCart() {
    await this.loadCarts();
    this.cart.push({ cid: uuid(), products: [] });

    await writeFile(this.path, JSON.stringify(this.cart));
    return { message: "Carrito creado correctamente" };
  }

  async addProduct(cid: string, pid: string) {
    await this.loadCarts();
    const products = await productManager.getProducts();
    const productFinded = products.find((product) => product.id === pid);

    if (productFinded === undefined) {
      return {
        message:
          "El producto que intentas agregar no existe en la base de datos.",
      };
    }

    let cartExists = false;

    this.cart.map((cart) => {
      if (cart.cid === cid) {
        cartExists = true;

        const productInCart = cart.products.find(
          (product) => product.pid === pid
        );

        if (productInCart) {
          productInCart.quantity++;
        } else {
          cart.products.push({
            pid: pid,
            quantity: 1,
          });
        }
      }
    });

    if (!cartExists) {
      return {
        message: "No se puede agregar un producto a un carrito que no existe.",
      };
    }

    await writeFile(this.path, JSON.stringify(this.cart));
    return { message: "El producto fue agregado al carrito." };
  }

  private async loadCarts() {
    try {
      const fileContent = await readFile(this.path, "utf-8");
      this.cart = JSON.parse(fileContent);
    } catch (error) {
      this.cart = [];
      return { message: error };
    }
  }
}

export default CartManager;
