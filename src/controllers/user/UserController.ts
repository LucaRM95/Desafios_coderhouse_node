import { validatePass } from "../../services/helpers/auth/auth_helpers";
import { UserModel } from "../../services/interfaces/UserInterface";
import UserDao from "../../dao/user/UserDao";

class UserController {
  static async loginUser(email: string, pass: string) {
    try {
      const userFinded: UserModel | any = await UserDao.get({ email });

      if (!userFinded) {
        return { status: 401, message: "Password or email are invalid." };
      }

      const isValidPassword = validatePass(pass, userFinded[0]);

      if (!isValidPassword) {
        return { status: 401, message: "Password or email are invalid." };
      }

      return { status: 200, message: "You have logged successfully." };
    } catch (error: any) {
      return {
        status: 500,
        message: `Server Internal Error: ${error.message}.`,
      };
    }
  }

  static async registerUser(user: UserModel) {
    try {
      const res: UserModel | any = await UserDao.create(user);
      if (!res) {
        return {
          status: 400,
          message: "An error has occurred trying to register the user.",
        };
      }
      return { status: 201, message: "You has been registered successfully." };
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async findOne(email: string, action: string = "LOGIN") {
    try {
      const userFinded = await UserDao.get({ email });
  
      if (!userFinded) {
        return action === "REGISTER"
          ? null
          : { status: 404, message: "User not finded or not exists." };
      }
  
      return userFinded[0];
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }

  static async findAndAsociateCart(id: string, cartId: string) {
    try {
      const result = await UserDao.update({ _id: id }, { $set: { cid: cartId } });
  
      if (!result) {
        return {
          status: 400,
          message: "An error was ocurred when trying to update the user.",
        };
      }
  
      return result;
    } catch (error: any) {
      throw new Error(`Internal Server Error: ${error?.message}.`);
    }
  }
}

export default UserController;
