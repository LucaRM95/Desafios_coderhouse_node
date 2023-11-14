import { v4 as uuid } from "uuid";
import ProductsManager from "../products/ProductsManager";
import Cart from "../../models/cart/carts.model";
import { ProductModel } from "../../interfaces/ProductInterface";
import { CartModel, CartProduct } from "../../interfaces/CartInterface";

const productManager = new ProductsManager();

class CartManager {
  async getCart(cid: string) {
    try {
      const res = await Cart.findById(cid).exec();
  
      if (!res) {
        return null;
      }
  
      // Realizar la población directamente sobre el array de productos
      const populatedProducts = await Cart.populate(res, {
        path: 'products.pid',
        model: 'Product',
        select: 'title description category thumbnail price',
      });
  
      return populatedProducts;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }

  async createCart() {
    await Cart.insertMany({ _id: uuid(), products: [] });

    return { message: "Carrito creado correctamente" };
  }

  async addProduct(cid: string, pid: string) {
    const products = await productManager.getProducts();
    const productFinded = products?.payload.find(
      (product: ProductModel) => product._id === pid
    );

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
        { $push: { products: { pid, quantity: 1 } } }
      );
    }
  }

  async updateQuantity(cid: string, _pid: string, quantity: number) {
    const cart: CartModel | null = await Cart.findById(cid);

    const productFinded = cart?.products.find((product: CartProduct) => product.pid === _pid);

    if (productFinded === undefined) {
      return {
        status: 404,
        message: "El producto que intentas agregar no esta en el carrito.",
      };
    }

    if (cart) {
      await Cart.updateOne(
        { _id: cid, "products.pid": _pid },
        { $inc: { "products.$.quantity": quantity } }
      );
    }

    return { status: 200, message: "Cantidad actualizada correctamente." };
  }

  async updateProducts(cid: string, products: any) {
    const productosEnviados = [...products];
    const productsArray = await productManager.getProducts();

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

    const cart = await Cart.find({ _id: cid });

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

    await Cart.bulkWrite(bulkOps);

    return {
      status: 200,
      message: "Los productos fueron agregados correctamente",
    };
  }

  async deleteProduct(cid: string, _pid: string) {
    const cart = await Cart.findOne({ _id: cid, "products.pid": _pid });

    if (cart) {
      await Cart.updateOne(
        { _id: cid },
        { $pull: { products: { pid: _pid } } }
      );

      return { message: "Se ha eliminado el producto del carrito." };
    }
  }
}

export default CartManager;
