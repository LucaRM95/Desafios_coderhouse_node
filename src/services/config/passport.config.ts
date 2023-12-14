import passport from "passport";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import env from "../config/dotenv.config"
import User from "../../models/user/user.models";
import { UserModel } from "../interfaces/UserInterface";
import { hashPass } from "../helpers/auth/auth_helpers";
import { Strategy as LocalStrategy } from "passport-local";
import coookieExtractor from "../helpers/cookies/cookieExtractor";
import UserController from "../../controllers/user/UserController";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import CartDao from "../../dao/cart/CartDao";
import { CartModel } from "../interfaces/CartInterface";

const JWT_SECRET: string = env.JWT_SECRET || "";

const opts: any = {
  usernameField: "email",
  passReqToCallback: true,
};

const jwtOptions: any = {
  jwtFromRequest: ExtractJwt.fromExtractors([coookieExtractor]),
  secretOrKey: JWT_SECRET,
};

export const init = () => {
  passport.use(
    "register",
    new LocalStrategy(opts, async (req: Request, email, password, done) => {
      try {
        const user = await UserController.findOne(email, "REGISTER");
        
        if (user) {
          return done(
            null,
            {
              result: { status: 401, message: "User already register." },
            },
            undefined
          );
        }
        const cart: CartModel | any = await CartDao.create();
        
        const newUser: UserModel = {
          ...req.body,
          _id: uuidv4(),
          role: "USER",
          cid: cart?._id,
          password: hashPass(password),
        };

        const result = await UserController.registerUser(newUser);

        if (result.status !== 201) {
          return { message: result.message };
        }
        done(null, {
          result: result ? result : undefined,
          newUser: newUser ? newUser : undefined,
        });
      } catch (error: any) {
        done(
          new Error(`An error occurred during authentication ${error.message}.`)
        );
      }
    })
  );

  passport.use(
    "login",
    new LocalStrategy(opts, async (req: Request, email, password, done) => {
      try {
        const user: UserModel | any = await UserController.findOne(email);

        done(null, {
          user: user ? user : undefined,
        });
      } catch (error: any) {
        done(
          new Error(`An error occurred during authentication ${error.message}.`)
        );
      }
    })
  );

  passport.use(
    "jwt",
    new JWTStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false, { message: "Error authenticating user" });
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user?._id);
  });

  passport.deserializeUser(async (uid, done) => {
    const user = await User.findById(uid);
    done(null, user);
  });
};
