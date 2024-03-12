import passport from "passport";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import expressSession from "express-session";
import cartRouter from "./routes/cart/cart.routes";
import userRouter from "./routes/users/user.routes";
import productsRouter from "./routes/products/products.routes";
import env  from "./services/config/dotenv.config";
import { init as initPassport } from './services/config/passport.config';
import express, { Express, NextFunction, Request, Response, urlencoded } from "express";
import { passport_jwt } from "./services/helpers/auth/passport_function";
import Exception from "./services/errors/GeneralException";
import orderRoutes from "./routes/order/order.routes";
import mockRoutes from "./routes/mock/mock.routes";
import swaggerSpec from "./swaggerOptions";
import authRouter from "./routes/sessions/auth.routes";
import cors from "cors";

const app: Express = express();

app.use(cors());

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

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cookieParser(env.COOKIE_SECRET || ""));
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).redirect("api/products");
});

initPassport();

app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/api", productsRouter, mockRoutes);
app.use("/api/cart", passport_jwt, cartRouter);
app.use("/api/order", orderRoutes);
app.use("/api/users", passport_jwt, userRouter);

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
