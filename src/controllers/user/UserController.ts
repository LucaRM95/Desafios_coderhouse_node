import { validatePass } from "../../services/helpers/auth/auth_helpers";
import { UserModel } from "../../services/interfaces/UserInterface";
import UserDao from "../../dao/user/UserDao";

class UserController {
  static async registerUser(user: UserModel) {
    const res: UserModel | any = await UserDao.registerUser(user);
    if (!res) {
      return {
        status: 400,
        message: "An error has occurred trying to register the user.",
      };
    }
    return { status: 201, message: "You has been registered successfully." };
  }

  static async loginUser(email: string, pass: string) {
    try {
      const userFinded: UserModel | any = await UserDao.findOneUser({ email });
      if (!userFinded) {
        return { status: 401, message: "Password or email are invalid." };
      }

      const isValidPassword = validatePass(pass, userFinded);
      
      if (!isValidPassword) {
        return { status: 401, message: "Password or email are invalid." };
      }
      
      return { status: 200, message: "You have logged successfully." };
    } catch (error) {
      return {
        status: 500,
        message: "An error has occurred trying to register the user.",
      };
    }
  }

  static async findOneUser(email: string, action: string = "LOGIN") {
    const userFinded = await UserDao.findOneUser({ email });

    if (!userFinded) {
      return action === "REGISTER"
        ? null
        : { status: 404, message: "User not finded or not exists." };
    }

    return userFinded;
  }

  static async findUserByCart(cid: string) {
    const userFinded = await UserDao.findOneUser({ cid });

    return userFinded;
  }

  static async findAndAsociateCart(id: string, cartId: string) {
    const result = await UserDao.findAndAsociateCart(id, cartId);
    
    if (!result) {
      return {
        status: 400,
        message: "An error was ocurred when trying to update the user.",
      };
    }

    return result;
  }
}

export default UserController;
