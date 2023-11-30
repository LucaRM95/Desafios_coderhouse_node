import path from "path";
import bycrypt from "bcrypt";
import { UserModel } from "../../interfaces/UserInterface";

export const __dirname = path.resolve();

export const hashPass = (pass: string) =>
  bycrypt.hashSync(pass, bycrypt.genSaltSync(10));

export const validatePass = (pass: string, user: UserModel) =>
  bycrypt.compareSync(pass, user.password);

// export const authMiddleware =
//   (strategy: any) => (req: Request, res: Response, next: NextFunction) => {
//     passport.authenticate(strategy, function (err: any, payload: any, info: any) {
//       if (err) {
//         return res.status(500).json({ message: "Internal Server Error" });
//       }
//       if (!payload) {
//         return res
//           .status(401)
//           .json({ message: "Unauthorized because token is invalid or not provided." });
//       }

//       req.user = {...payload, role: (req.session as any).user.role};
//       next();
//     })(req, res, next);
//   };