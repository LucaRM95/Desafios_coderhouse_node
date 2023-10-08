import { writeFile, readFile } from "fs/promises";
import { ProductModel } from "../../models/ProductModel";

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

  async getProductByID(id: string) {
    await this.loadProducts();
    return (
      this.products.find(
        (product) => product.id === id || product.code === id
      ) || { message: `El producto con id: ${id} no existe` }
    );
  }

  async updateProduct(
    id: string | number,
    updatedProduct: Partial<ProductModel>
  ) {
    await this.loadProducts();

    const index = this.products.findIndex(
      (product) => product.code === id || product.id === id
    );

    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedProduct,
      };

      await writeFile(this.path, JSON.stringify(this.products));

      return { message: "El producto se actualizó correctamente" };
    } else {
      return { message: "El producto buscado no se encontró" };
    }
  }

  async deleteProduct(id: string | number) {
    await this.loadProducts();
    const newProducts = this.products.filter(
      (product) => product.code !== id && product.id != id
    );
    if(this.products.length === newProducts.length){
      return 1;
    }
    await writeFile(this.path, JSON.stringify(newProducts));
    return 0;
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
