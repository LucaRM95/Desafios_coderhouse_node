import path from "path";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import expressSession from "express-session";
import indexRouter from './routes/index.routes';
import express, { Express, Request, Response, urlencoded } from "express";
import productsRouter from "./routes/products/products.routes";
import cartRouter from "./routes/cart/cart.routes";
import { __dirname } from "./services/helpers/utils";
import userRouter from "./routes/users/user.routes";
import { init as initPassport } from './services/config/passport.config';
import passport from "passport";

const app: Express = express();

app.use(
  expressSession({
    secret: "qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.URI,
      mongoOptions: {},
      ttl: 120,
    }),
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

app.engine("handlebars", engine());
app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "handlebars");

app.get("/", (req: Request, res: Response) => {
  res.status(200).redirect("api/products");
});

initPassport();

app.use(passport.initialize());

app.use('/', indexRouter);
app.use("/auth", userRouter);
app.use("/api", productsRouter);
app.use("/api/carts", cartRouter);

//Middleware para manejar páginas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Uuups, La página buscada no existe" });
});

export default app;
