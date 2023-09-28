import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import ProductsManager from "./classes/ProductsManager";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const productManager = new ProductsManager();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Express + TypeScript Server" });
});

app.get("/products", async (req: Request, res: Response) => {
  const limitParam = req.query.limit;

  const limit =
    typeof limitParam === "string" ? parseInt(limitParam, 10) || 4 : 4;
  const allProducts = await productManager.getProducts();

  const limitedProducts = allProducts.slice(0, limit);

  res.json(limitedProducts);
});

app.get("/product/:pid", async (req: Request, res: Response) => {
  const params = req.params.pid;
  const productId = typeof params === "string" ? parseInt(params, 10) || 1 : 1;

  try {
    const productById = await productManager.getProductByID(productId);
    res.json(productById);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

// Middleware para manejar páginas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Uuups, La página buscada no existe" });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
