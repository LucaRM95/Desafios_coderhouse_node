import { ProductModel } from "../../services/interfaces/ProductInterface";
import Product from "../../models/products/products.model";
import buildResponse from "../../services/helpers/buildResponse";

class ProductsDao {
  static async addProduct(product: ProductModel) {
    try {
      const result = await Product.insertMany(product);

      return result;
    } catch (error: any) {
        throw new Error(`Internal Server Error: ${error?.message}`)
    }
  }

  static async getProducts(
    limitParam: any = 10,
    pageNumber: any = 1,
    sortParam: any = 0,
    criteria: any = {}
  ) {
    const options = {
      limit: limitParam,
      page: pageNumber,
      sort: sortParam == 1 || sortParam == -1 ? { price: sortParam } : {},
    };
    
    try {
        const response = await Product?.paginate(criteria, options);
        const newResponse = buildResponse(response);

        return newResponse;
    } catch (error: any) {
        throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async getProductByID(criteria={}) {
    try {
        const res = await Product.findOne(criteria);
    
        return res; 
    } catch (error: any) {
        throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async updateProduct(
    id: string | number,
    updatedProduct: Partial<ProductModel>
  ) {
    try {
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
    } catch (error: any) {
        throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async deleteProduct(id: string | number) {
    try {
        const res = await Product.deleteOne({
          $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
        });
    
        return res;
    } catch (error: any) {
        throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }
}

export default ProductsDao;
