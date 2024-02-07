import { v4 as uuidv4 } from "uuid";
import ProductsDao from "../../dao/products/ProductsDao";
import buildResponse from "../../services/helpers/buildResponse";
import NotFoundException from "../../services/errors/NotFoundException";
import ConflictException from "../../services/errors/ConflictException";
import { ProductModel } from "../../services/interfaces/ProductInterface";
import BadRequestException from "../../services/errors/BadRequestException";

class ProductsController {
  static async addProduct(product: ProductModel, currentUser: any) {
    const criteria = {
      $or: [{ _id: { $eq: product._id } }, { code: { $eq: product.code } }],
    };
    const productFinded: any = await ProductsDao.get(criteria);
    if (productFinded.length > 0) {
      throw new ConflictException(
        `The product with id ${product.code} already exists in the database.`
      );
    }

    const {
      code,
      title,
      description,
      category,
      price,
      thumbnail = [],
      stock = 0,
    }: ProductModel = product;

    const newProduct = {
      _id: uuidv4(),
      code,
      owner: currentUser.role === "PREMIUM" ? currentUser.email : "ADMIN",
      status: true,
      title,
      category,
      thumbnail,
      description,
      price,
      stock,
    };

    return ProductsDao.create(newProduct);
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

    const products: any = await ProductsDao.get(criteria, true, options);
    const newProductsResponse = buildResponse(products);

    if (newProductsResponse?.payload.length === 0) {
      throw new BadRequestException("Doesn't exists products in database.");
    }

    return newProductsResponse;
  }

  static async getProductByID(id: string | number) {
    const criteria = {
      $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
    };

    const res: any = await ProductsDao.get(criteria);

    if (res.length === 0) {
      throw new NotFoundException(
        `The product with id ${id} doesn't exists in the database.`
      );
    }

    return res;
  }

  static async updateProduct(
    id: string | number,
    updatedProduct: Partial<ProductModel>
  ) {
    const criteria = {
      $or: [{ _id: { $eq: id } }, { code: { $eq: id } }],
    };
    const res = await ProductsDao.update(criteria, { $set: updatedProduct });

    if (res.matchedCount === 0) {
      throw new NotFoundException(
        `The product with id ${id} doesn't exists in database.`
      );
    }

    return { message: "Product has been updated successfully." };
  }

  static async deleteProduct(id: string | number) {
    const res = await ProductsDao.delete(id);

    if (!id) {
      throw new BadRequestException(
        "The id is necessary to delete the product."
      );
    }
    if (res.deletedCount !== 1) {
      throw new NotFoundException(
        "The product to trying to delete doesn't exists in database."
      );
    }
  }
}

export default ProductsController;
