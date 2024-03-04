import express, { IRouter, NextFunction, Request, Response } from "express";
import { passport_jwt } from "../../services/helpers/auth/passport_function";
import UserController from "../../controllers/user/UserController";
import { uploader } from "../../services/config/multer.config";
import { UserModel } from "../../services/interfaces/UserInterface";
import { authPolicies } from "../../services/helpers/auth/auth_policies";

const userRouter: IRouter = express.Router();

userRouter.get(
  "/",
  authPolicies(["ADMIN", "PREMIUM"], "view"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserController.getUsers();

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get(
  "/premium/:uid",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.params;
      await UserController.changeUserRole(uid);

      res.status(200).json({ message: "You role has been changed." });
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/:uid/documents",
  passport_jwt,
  uploader.single("reference"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.params;
      await UserController.uploadDocuments(req, uid);

      res.status(200).json({ message: "Document uploaded successfully." });
    } catch (error) {
      next(error);
    }
  }
);

userRouter.delete(
  "/inactives",
  authPolicies(["ADMIN"], "delete"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ahora = Date.now();
      const connection_limit = ahora - 2 * 24 * 60 * 60 * 1000;
      await UserController.deleteInactiveUsers(connection_limit);

      res.send({
        status: "ok",
        message: "Usuarios inactivos eliminados correctamente.",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
