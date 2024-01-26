import { validatePass } from "../../services/helpers/auth/auth_helpers";
import { UserModel } from "../../services/interfaces/UserInterface";
import UserDao from "../../dao/user/UserDao";
import NotFoundException from "../../services/errors/NotFoundException";
import UnauthorizedException from "../../services/errors/UnauthorizedException";
import BadRequestException from "../../services/errors/BadRequestException";
import {
  generateResetToken,
  verifyResetToken,
  verifyToken,
} from "../../services/helpers/auth/token_helpers";
import EmailService from "../../services/email/email.service";
import Exception from "../../services/errors/GeneralException";
import { query } from "express";

class UserController {
  static async loginUser(email: string, pass: string) {
    const userFinded: UserModel | any = await UserDao.get({ email });

    if (!userFinded) {
      throw new NotFoundException("Password or email are invalid.");
    }

    const isValidPassword = validatePass(pass, userFinded[0]);

    if (!isValidPassword) {
      throw new NotFoundException("Password or email are invalid.");
    }

    return userFinded;
  }

  static async changeUserRole(uid: string | number) {
    const findedUser: Array<UserModel> | any = await UserDao.get({ _id: uid });
    if (!findedUser) {
      throw new NotFoundException("User not finded or not exists.");
    }

    if (findedUser[0].role === "ADMIN") {
      throw new Exception(
        "You can't change your role because you're an Admin",
        400
      );
    }

    const role = findedUser[0].role === "PREMIUM" ? "USER" : "PREMIUM";

    const criteria = { $set: { role: role } };
    const res = await UserDao.update({ _id: uid }, criteria);

    if(!res){
      throw new Exception("An error has occurred trying to change the user role.", 400);
    }
  }

  static async registerUser(user: UserModel) {
    const res: UserModel | any = await UserDao.create(user);
    if (!res) {
      throw new UnauthorizedException(
        "An error has occurred trying to register the user."
      );
    }
    return { message: "You has been registered successfully." };
  }

  static async findOne(email: string, action: string = "LOGIN") {
    const userFinded = await UserDao.get({ email });

    if (!userFinded) {
      if (action === "REGISTER") {
        return null;
      }
      throw new NotFoundException("User not finded or not exists.");
    }

    return userFinded[0];
  }

  static async findAndAsociateCart(id: string, cartId: string) {
    const result = await UserDao.update({ _id: id }, { $set: { cid: cartId } });

    if (!result) {
      throw new BadRequestException(
        "An error was ocurred when trying to update the user."
      );
    }

    return result;
  }

  static async requestPasswordReset(email: string) {
    const emailService = new EmailService();
    const user: UserModel | any = await UserDao.get({ email });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const resetToken = generateResetToken(user);
    const resetLink = `http://localhost:8080/auth/reset-password?token=${resetToken}`;

    await emailService.sendResetPasswordEmail(email, resetLink);
  }

  static async resetPassword(req: Request | any) {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      throw new BadRequestException(
        "Falta o es inválido el token en la consulta."
      );
    }

    const decodedToken: any = await verifyResetToken(token);

    if (decodedToken.exp < Date.now() / 1000) {
      throw new Exception(
        "El token ha expirado, por favor solicite uno nuevo.",
        400
      );
    }

    return token;
  }
}

export default UserController;
