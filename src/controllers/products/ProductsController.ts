import { ProductModel } from "../../services/interfaces/ProductInterface";
import ProductsDao from "../../dao/products/ProductsDao";
import buildResponse from "../../services/helpers/buildResponse";

class ProductsController {
  static async addProduct(product: ProductModel) {
    try {
      await ProductsDao.create(product);
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error.message}.`);
    }
  }

  static async getProducts(
    limitParam: any = 10,
    pageNumber: any = 1,
    sortParam: any = 0,
    criteria: any = {}
  ) {
    try {
      const options = {
        limit: limitParam,
        page: pageNumber,
        sort: sortParam == 1 || sortParam == -1 ? { price: sortParam } : {},
      };
  
      const products: any = await ProductsDao.get(criteria, true, options);
      const newProductsResponse = buildResponse(products);
  
      if (newProductsResponse?.payload.length === 0) {
        return { status: 400, message: "Doesn't exists products in database." };
      }
      
      return { status: 200, newProductsResponse };
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async getProductByID(id: string | number) {
    try {
      const criteria = {
        $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
      };

      const res = await ProductsDao.get(criteria);
      
      return res;
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error.message}.`);
    }
  }

  static async updateProduct(
    id: string | number,
    updatedProduct: Partial<ProductModel>
  ) {
    try {
      const res = await ProductsDao.update(id, updatedProduct);
      
      if (res.matchedCount === 0) {
        return {
          status: 404,
          message: `The product with id ${id} doesn't exists in database.`,
        };
      }

      return { status: 200, message: "Product has been updated successfully." };
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error.message}.`);
    }
  }

  static async deleteProduct(id: string | number) {
    try {
      const res = await ProductsDao.delete(id);
  
      return res.deletedCount;
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error.message}.`);
    }
  }
}

export default ProductsController;
