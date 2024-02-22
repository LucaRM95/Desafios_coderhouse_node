import express, { IRouter, NextFunction, Request, Response } from "express";
import {
  passport_jwt,
} from "../../services/helpers/auth/passport_function";
import UserController from "../../controllers/user/UserController";
import { uploader } from "../../services/config/multer.config";

const userRouter: IRouter = express.Router();

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

export default userRouter;
