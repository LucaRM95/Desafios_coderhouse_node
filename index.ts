import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import ProductsManager from "./src/classes/ProductsManager";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const productManager = new ProductsManager();

app.get("/", (req: Request, res: Response) => {
  res.send({ messsage: "Express + TypeScript Server" });
});

app.get("/products", async (req: Request, res: Response) => {
  const limitParam = req.query.limit;

  const limit =
    typeof limitParam === "string" ? parseInt(limitParam, 4) || 4 : 4;
  const allProducts = await productManager.getProducts();

  const limitedProducts = allProducts.slice(0, limit);

  res.send(limitedProducts);
});

app.get("/product/:pid", async (req: Request, res: Response) => {
  const params = req.params.pid;
  const productId = typeof params === "string" ? parseInt(params) || 1 : 1;

  const productById = await productManager.getProductByID(productId);

  res.send(productById);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
