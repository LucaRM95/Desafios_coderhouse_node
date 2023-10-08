import express, { Express, Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products/ProductsRoutes";
import cartRouter from "./routes/cart/CartRoutes";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).redirect('api/products');
});

app.use('/api', productsRouter);
app.use('/api/carts', cartRouter);

//Middleware para manejar páginas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Uuups, La página buscada no existe" });
});

export default app;