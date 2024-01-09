import express, { IRouter, NextFunction, Request, Response } from "express";
import { generateProducts } from "../../services/mocks/generateProducts";

const mockRoutes: IRouter = express.Router();

mockRoutes.get('/mockingproducts', (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = generateProducts();
        
        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

export default mockRoutes;