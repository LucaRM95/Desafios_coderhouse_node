import { validatePass } from "../../services/helpers/auth/auth_helpers";
import { UserModel } from "../../services/interfaces/UserInterface";
import User from "../../models/user/user.models";

class UserController {
  static async registerUser(user: UserModel) {
    try {
      await User.create(user);
      return { status: 201, message: "You has been registered successfully." };
    } catch (error) {
      return {
        status: 500,
        message: "An error has occurred trying to register the user.",
      };
    }
  }

  static async loginUser(email: string, pass: string) {
    try {
      const userFinded: UserModel | any = await User.findOne({ email });
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
    try {
      const userFinded = await User.findOne({ email });

      if (!userFinded) {
        return action === "REGISTER"
          ? null
          : { status: 404, message: "User not finded or not exists." };
      }

      return userFinded;
    } catch (error) {
      return {
        status: 500,
        message: "Server internal error.",
      };
    }
  }
  
  static async findUserByCart( cid: string ) {
    try {
      const userFinded = await User.findOne({ cid });
      
      return userFinded;
    } catch (error) {
      return {
        status: 500,
        message: "Server internal error.",
      };
    }
  }

  static async findAndAsociateCart(id: string, cartId: string) {
    try {
      const result = await User.updateOne({ _id: id }, { $set: { cid: cartId } });

      if (!result) {
        return {
          status: 400,
          message: "An error was ocurred when trying to update the user.",
        };
      }

      return { status: 200 };
    } catch (error) {
      return {
        status: 500,
        message: "Server internal error.",
      };
    }
  }
}

export default UserController;
