import path from "path";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import express, { Express, Request, Response, urlencoded } from "express";
import productsRouter from "./routes/products/ProductsRoutes";
import cartRouter from "./routes/cart/cartRoutes";
import { __dirname } from "./helpers/utils";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

app.engine('handlebars', engine());
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'handlebars');

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