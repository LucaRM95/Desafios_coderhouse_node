import { ProductModel } from "../../services/interfaces/ProductInterface";
import ProductsDao from "../../dao/products/ProductsDao";

class ProductsController {
  static async addProduct(product: ProductModel) {
    await ProductsDao.addProduct(product);
  }

  static async getProducts(
    limitParam: any = 10,
    pageNumber: any = 1,
    sortParam: any = 0,
    criteria: any = {}
  ) {
    const response = await ProductsDao.getProducts(
      limitParam,
      pageNumber,
      sortParam,
      criteria
    );

    if (response?.payload.length === 0) {
      return { status: 400, message: "Doesn't exists products in database." };
    }

    return { status: 200, response};
  }

  static async getProductByID(id: string) {
    const res = ProductsDao.getProductByID({
      $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
    });

    return res;
  }

  static async updateProduct(
    id: string | number,
    updatedProduct: Partial<ProductModel>
  ) {
    const res = ProductsDao.updateProduct(id, updatedProduct);

    return res;
  }

  static async deleteProduct(id: string | number) {
    const res = await ProductsDao.deleteProduct(id);

    return res.deletedCount;
  }
}

export default ProductsController;
