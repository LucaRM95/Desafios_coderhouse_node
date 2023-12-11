import { v4 as uuid } from "uuid";
import ProductsDao from "../../dao/products/ProductsDao";
import Cart from "../../models/cart/carts.model";
import { ProductModel } from "../../services/interfaces/ProductInterface";
import { CartModel } from "../../services/interfaces/CartInterface";
import CartDao from "../../dao/cart/CartDao";

class CartController {
  static async getCart(cid: string) {
    const cart = await CartDao.getCart(cid);

    return cart;
  }

  static async createCart() {
    const cart: CartModel | any = await Cart.create({
      _id: uuid(),
      products: [],
    });

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
  }

  static async addProduct(cid: string, pid: string) {
    const products = await ProductsDao.getProducts();
    const productFinded = products?.payload.find(
      (product: ProductModel) => product._id === pid
    );

    if (productFinded === undefined) {
      return {
        status: 404,
        message:
          "El producto que intentas agregar no existe en la base de datos.",
      };
    }

    await CartDao.addProduct(cid, pid);

    return { status: 200, message: `Product has added to cart ${cid}.` };
  }

  static async updateQuantity(cid: string, _pid: string, quantity: number) {
    const res = await CartDao.updateQuantity(cid, _pid, quantity);
    if (res.modifiedCount === 0) {
      return {
        status: 404,
        message: "No existe producto o carrito para actualizar la cantidad.",
      };
    }

    return { status: 200, message: "Cantidad actualizada correctamente." };
  }

  static async updateProducts(cid: string, products: any) {
    const productosEnviados = [...products];
    const productsArray = await ProductsDao.getProducts();
   
    let productosEncontrados = [];

    for (const productoEnviado of productosEnviados) {
      const encontrado = productsArray.payload.find(
        (product: any) => product._id === productoEnviado.pid
      );

      if (encontrado) {
        productosEncontrados.push(encontrado);
      }
    }

    if (productosEncontrados.length !== productosEnviados.length) {
      return {
        status: 400,
        message: "Enviaste un producto que no existe en la bbdd.",
      };
    }

    const bulkOps = products.map((product: any) => ({
      updateOne: {
        filter: { _id: cid, "products.pid": product.pid },
        update: {
          $inc: {
            "products.$.quantity": 1,
          },
        },
      },
    }));

    const cart: CartModel | any = await CartDao.getCart(cid);

    products.forEach((product: any) => {
      const found = bulkOps.find(
        (op: any) => op.updateOne.filter["cart.products.pid"] === product.pid
      );

      if (!found) {
        if (cart[0] && Array.isArray(cart[0].products)) {
          const productsArray = Array.from(cart[0].products);
          const productInCart = productsArray.filter(
            (cartProduct: any) => cartProduct.pid === product.pid
          );

          if (productInCart.length === 0) {
            bulkOps.push({
              updateOne: {
                filter: { _id: cid },
                update: {
                  $addToSet: {
                    products: {
                      pid: product.pid,
                      quantity: product.quantity,
                    },
                  },
                },
              },
            });
          }
        }
      }
    });

    await CartDao.updateProducts(bulkOps);

    return {
      status: 200,
      message: "Los productos fueron agregados correctamente",
    };
  }

  static async deleteProduct(cid: string, _pid: string) {
    const deleted_product = await CartDao.deleteProduct(cid, _pid);
    if (deleted_product.modifiedCount === 0) {
      return {
        status: 404,
        message:
          "El producto que deseas eliminar no existe o ya fue eliminado.",
      };
    }
    return { status: 200, message: "Se ha eliminado el producto del carrito." };
  }
}

export default CartController;
