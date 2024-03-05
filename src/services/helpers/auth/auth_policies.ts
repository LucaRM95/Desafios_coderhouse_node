import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../interfaces/UserInterface";
import ProductsController from "../../../controllers/products/ProductsController";
import UnauthorizedException from "../../errors/UnauthorizedException";
import { ProductModel } from "../../interfaces/ProductInterface";

export const authPolicies =
  (roles: Array<string>, action: string = "add") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (roles.includes("USER")) {
        if (req.originalUrl.includes("/api/cart/product") && action === "add") {
          const productFinded: Array<ProductModel> =
            await ProductsController.getProductByID(req.body?.pid);
          if (
            productFinded &&
            productFinded.length > 0 &&
            (req.user as UserModel).email ===
              (productFinded[0] as ProductModel)?.owner
          ) {
            throw new UnauthorizedException(
              "You're the owner of this product and you can't add to cart."
            );
          }
        }

        return next();
      }
      const { role }: UserModel | any = req?.user;
      if (!roles.includes(role)) {
        throw new UnauthorizedException(
          `Sorry, you don't have authorization to ${action} a product.`
        );
      }
      if (
        req.originalUrl.includes("/api/product") &&
        (action === "edit" || action === "delete")
      ) {
        const productFinded: Array<ProductModel> =
          await ProductsController.getProductByID(req.params?.pid);
        if (
          productFinded &&
          productFinded.length > 0 &&
          (req.user as UserModel)?.email !==
            (productFinded[0] as ProductModel)?.owner &&
          (req.user as UserModel)?.role !== "ADMIN"
        ) {
          throw new UnauthorizedException(
            "Only the owner or an Admin can modify or delete this product."
          );
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
