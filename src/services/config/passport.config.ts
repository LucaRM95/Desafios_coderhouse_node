import passport from "passport";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../../models/user/user.models";
import { UserModel } from "../interfaces/UserInterface";
import { hashPass, validatePass } from "../helpers/auth/auth_helpers";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import UserController from "../../controllers/user/UserController";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import coookieExtractor from "../helpers/cookies/cookieExtractor";

const JWT_SECRET: string = process.env.JWT_SECRET || "";

const opts: any = {
  usernameField: "email",
  passReqToCallback: true,
};

const jwtOptions: any = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    coookieExtractor,
    // ExtractJwt.fromHeader('Authorization'),
    // ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: JWT_SECRET,
};

export const init = () => {
  passport.use(
    "register",
    new LocalStrategy(opts, async (req: Request, email, password, done) => {
      try {
        const user = await UserController.findOneUser(email, "REGISTER");
        
        if (user) {
          return done(
            null,
            {
              result: { status: 401, message: "User already register." },
            },
            undefined
          );
        }
        const newUser: UserModel = {
          ...req.body,
          _id: uuidv4(),
          role: "USER",
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
        const result = await UserController.loginUser(email, password);

        if (result.status !== 200) {
          return done(null, { result, user: undefined });
        }
        const user: UserModel | any = UserController.findOneUser(email);

        done(null, {
          result: result ? result : undefined,
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
    new JWTStrategy(jwtOptions, (payload, done) => {
      return done(null, payload);
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
