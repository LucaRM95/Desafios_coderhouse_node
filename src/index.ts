import express, { Express, Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/users/usersRoute";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).redirect('api/products');
});

app.use('/api', productsRouter);

//Middleware para manejar páginas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Uuups, La página buscada no existe" });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
