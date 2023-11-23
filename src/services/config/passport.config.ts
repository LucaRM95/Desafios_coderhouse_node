import passport from "passport";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { hashPass, validatePass } from "../helpers/utils";
import User from "../../models/user/user.models";

const JWT_SECRET: string = process.env.JWT_SECRET || "";

function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
}

const opts: any = {
  usernameField: "email",
  passReqToCallback: true,
};

const githubOpts: any = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
};

export const init = () => {
  passport.use(
    "register",
    new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (user) {
          return done(new Error("User already register 😨"));
        }
        const newUser = await User.create({
          ...req.body,
          password: hashPass(password),
        });
        done(null, newUser);
      } catch (error: any) {
        done(
          new Error(
            `Ocurrio un error durante la autenticacion ${error.message} 😨.`
          )
        );
      }
    })
  );

  passport.use(
    "login",
    new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(new Error("Correo o contraseña invalidos 😨"));
        }
        const isPassValid = validatePass(password, user);
        if (!isPassValid) {
          return done(new Error("Correo o contraseña invalidos 😨"));
        }
        done(null, user);
      } catch (error: any) {
        done(
          new Error(
            `Ocurrio un error durante la autenticacion ${error.message} 😨.`
          )
        );
      }
    })
  );

  passport.use(
    "github",
    new GithubStrategy(
      githubOpts,
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        let email = profile._json.email;

        try {
          let user: any = await User.findOne({ email });
          if (user) {
            return done(null, user);
          }
          user = {
            _id: uuidv4(),
            first_name: profile._json.name,
            last_name: "",
            email,
            role: "Github",
            age: 18,
            password: "",
          };
          const newUser = await User.create(user);
          done(null, newUser);
        } catch (err) {
          console.error("Error during GitHub authentication:", err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user?._id);
  });

  passport.deserializeUser(async (uid, done) => {
    const user = await User.findById(uid);
    done(null, user);
  });
};
