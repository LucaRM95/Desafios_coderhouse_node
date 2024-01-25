import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../interfaces/UserInterface";
import ProductsController from "../../../controllers/products/ProductsController";
import UnauthorizedException from "../../errors/UnauthorizedException";

export const authPolicies =
  (roles: Array<string>, action: string = "add") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (roles.includes("USER")) {
        return next();
      }
      const { role }: UserModel | any = req.user;
      if (!roles.includes(role)) {
        throw new UnauthorizedException(
          `Sorry, you don't have authorization to ${action} a product.`
        );
      }
      if(req.originalUrl.includes('/api/product') && (action === "edit" || action === "delete")){
        const productFinded = await ProductsController.getProductByID(req.params?.pid); 
        if((req.user as UserModel).email !== productFinded?.owner && (req.user as UserModel).role !== 'ADMIN'){
          throw new UnauthorizedException("Only the owner or an Admin can modify or delete this product.");
        }
      }
      next();
    } catch (error) {
      next(error)
    }
  };
