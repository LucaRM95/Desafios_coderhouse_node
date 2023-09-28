import { writeFile, readFile } from "fs/promises";
import { ProductModel } from "../interfaces/ProductModel";

class ProductsManager {
  private path: string;
  private products: Array<ProductModel>;

  constructor() {
    this.path = "./db/products.txt";
    this.products = [];
  }

  async addProduct(product: ProductModel) {
    await this.loadProducts();
    this.products = [...this.products, product];
    await writeFile(this.path, JSON.stringify(this.products));
  }

  async getProducts() {
    await this.loadProducts();
    if (this.products.length > 0) {
      return this.products;
    } else {
      return []
    }
  }

  async getProductByID(id: number) {
    await this.loadProducts();
    return (
      this.products.find(
        (product) => product._id === id
      ) || { message: `El producto con id: ${id} no existe` }
    );
  }

  async updateProduct(
    id: string | number,
    updatedProduct: Partial<ProductModel>
  ) {
    await this.loadProducts();

    const index = this.products.findIndex(
      (product) => product._code === id || product._id === id
    );

    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedProduct,
      };

      await writeFile(this.path, JSON.stringify(this.products));

      return "El producto se actualizó correctamente";
    } else {
      return "El producto buscado no se encontró";
    }
  }

  async deleteProduct(id: string | number) {
    await this.loadProducts();
    const newProducts = this.products.filter(
      (product) => product._code !== id && product._id != id
    );

    console.log(`Producto ${id} eliminado correctamente: `);
    console.log("*************************************");

    await writeFile(this.path, JSON.stringify(newProducts));
  }

  private async loadProducts() {
    try {
      const fileContent = await readFile(this.path, "utf-8");
      this.products = JSON.parse(fileContent);
    } catch (error) {
      this.products = [];
      return { message: error }
    }
  }
}

export default ProductsManager;
