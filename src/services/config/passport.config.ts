import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { hashPass, validatePass } from '../helpers/utils';
import User from '../../models/user/user.models';
import { UserModel } from '../interfaces/UserInterface';

const JWT_SECRET: string = process.env.JWT_SECRET || "";

function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
}

const opts: any = {
  usernameField: 'email',
  passReqToCallback: true,
};

export const init = () => {
  passport.use('register', new LocalStrategy(opts, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (user) {
        return done(new Error('User already register 😨'));
      }
      const newUser = await User.create({
        ...req.body,
        password: hashPass(password),
      });
      done(null, newUser);
    } catch (error: any) {
      done(new Error(`Ocurrio un error durante la autenticacion ${error.message} 😨.`));
    }
  }));

  passport.use('login', new LocalStrategy(opts, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(new Error('Correo o contraseña invalidos 😨'));
      }
      const isPassValid = validatePass(password, user);
      if (!isPassValid) {
        return done(new Error('Correo o contraseña invalidos 😨'));
      }
      done(null, user);
    } catch (error: any) {
      done(new Error(`Ocurrio un error durante la autenticacion ${error.message} 😨.`));
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user?._id);
  });

  passport.deserializeUser(async (uid, done) => {
    const user = await User.findById(uid);
    done(null, user);
  });
}