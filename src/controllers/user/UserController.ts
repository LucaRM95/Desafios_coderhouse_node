import { validatePass } from "../../services/helpers/auth/auth_helpers";
import { UserModel } from "../../services/interfaces/UserInterface";
import UserDao from "../../dao/user/UserDao";
import NotFoundException from "../../services/errors/NotFoundException";
import UnauthorizedException from "../../services/errors/UnauthorizedException";
import BadRequestException from "../../services/errors/BadRequestException";

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
}

export default UserController;
