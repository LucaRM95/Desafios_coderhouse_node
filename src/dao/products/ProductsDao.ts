import { ProductModel } from "../../services/interfaces/ProductInterface";
import Product from "../../models/products/product.models";

class ProductsDao {
  static get(criteria = {}, paginate = false, options = {}) {
    if (!paginate) {
      return Product.find(criteria);
    }
    return Product?.paginate(criteria, options);
  }

  static create(product: ProductModel) {
    return Product.create(product);
  }

  static update(
    criteria = {},
    query: any = {}
  ) {
    return Product.updateOne(criteria, query).exec();
  }

  static delete(id: string | number) {
    return Product.deleteOne({
      $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
    });
  }
}

export default ProductsDao;
