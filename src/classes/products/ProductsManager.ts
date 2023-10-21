import { ProductModel } from "../../interfaces/ProductModel";
import Product from "../../models/products/Products";

class ProductsManager {
  private products: Array<ProductModel>;

  constructor() {
    this.products = [];
  }

  async addProduct(product: ProductModel) {
    Product.insertMany(product);
  }

  async getProducts() {
    await this.loadProducts();
    if (this.products.length > 0) {
      return this.products;
    } else {
      return [];
    }
  }

  async getProductByID(id: string) {
    const res = Product.findOne({
      $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
    });

    return res;
  }

  async updateProduct(
    id: string | number,
    updatedProduct: Partial<ProductModel>
  ) {
    const res = Product.findOneAndUpdate(
      {
        $or: [{ _id: id }, { code: id }],
      },
      {
        code: updatedProduct.code,
        status: updatedProduct.status,
        title: updatedProduct.title,
        description: updatedProduct.description,
        category: updatedProduct.category,
        thumbnail: updatedProduct.thumbnail,
        price: updatedProduct.price,
        stock: updatedProduct.stock,
      }
    );

    return res;
  }

  async deleteProduct(id: string | number) {
    const res = await Product.deleteOne({
      $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
    });
    return res.deletedCount;
  }

  private async loadProducts() {
    try {
      this.products = await Product.find();
    } catch (error) {
      this.products = [];
      return { message: error };
    }
  }
}

export default ProductsManager;
