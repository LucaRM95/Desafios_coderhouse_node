import path from "path";
import { engine } from "express-handlebars";
import express, { Express, Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products/ProductsRoutes";
import cartRouter from "./routes/cart/CartRoutes";
import { __dirname } from "./helpers/utils";
import chatRouter from "./routes/messages/chat.router";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.engine('handlebars', engine());
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/messages', chatRouter);
app.use('/api', productsRouter);
app.use('/api/carts', cartRouter);

//Middleware para manejar páginas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Uuups, La página buscada no existe" });
});

export default app;