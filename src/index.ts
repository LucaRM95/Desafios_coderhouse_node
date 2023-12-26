import passport from "passport";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import cartRouter from "./routes/cart/cart.routes";
import userRouter from "./routes/users/user.routes";
import productsRouter from "./routes/products/products.routes";
import env  from "./services/config/dotenv.config";
import { init as initPassport } from './services/config/passport.config';
import express, { Express, NextFunction, Request, Response, urlencoded } from "express";
import sessionRouter from "./routes/sessions/session.routes";
import { passport_jwt } from "./services/helpers/auth/passport_function";
import Exception from "./services/errors/GeneralException";

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

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Exception) {
    res.status(error.getStatus()).json({ status: 'error', message: error.message });
  } else {
    const message = `Ha ocurrido un error desconocido: ${error.message}`;
    res.status(500).json({ status: 'error', message });
  }
});

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Page not found." })
})

export default app;
