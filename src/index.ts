import passport from "passport";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import cartRouter from "./routes/cart/cart.routes";
import userRouter from "./routes/users/user.routes";
import productsRouter from "./routes/products/products.routes";
import env  from "./services/config/dotenv.config";
import { init as initPassport } from './services/config/passport.config';
import express, { Express, Request, Response, urlencoded } from "express";
import sessionRouter from "./routes/sessions/session.routes";
import { passport_jwt } from "./services/helpers/auth/passport_function";

const app: Express = express();

app.use(
  expressSession({
    secret: env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.URI,
      mongoOptions: {},
      ttl: 2 * 60 * 60 * 1000,
    }),
  })
);

app.use(cookieParser(env.COOKIE_SECRET || ""));
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).redirect("api/products");
});

initPassport();

app.use(passport.initialize());

app.use("/auth", userRouter);
app.use("/api", productsRouter);
app.use("/api/carts", passport_jwt, cartRouter);
app.use("/sessions", sessionRouter);

//Middleware para manejar páginas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Uuups, La página buscada no existe" });
});

export default app;
