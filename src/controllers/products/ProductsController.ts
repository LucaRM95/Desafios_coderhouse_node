import { ProductModel } from "../../services/interfaces/ProductInterface";
import Product from "../../models/products/products.model";
import buildResponse from "../../services/helpers/buildResponse";

class ProductsController {
  static async addProduct(product: ProductModel) {
    Product.insertMany(product);
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
      sort:
        sortParam == 1 || sortParam == -1 ? { price: sortParam } : {},
    };
    const criteriaParsed = (criteria && criteria !== '{}') ? {} : JSON.parse(criteria);

    const response = await Product?.paginate(criteriaParsed, options );
    const newResponse = buildResponse(response);
    return newResponse;
  }

  static async getProductByID(id: string) {
    const res = Product.findOne({
      $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
    });

    return res;
  }

  static async updateProduct(
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

  static async deleteProduct(id: string | number) {
    const res = await Product.deleteOne({
      $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
    });

    return res.deletedCount;
  }
}

export default ProductsController;
