import { UserModel } from "../../services/interfaces/UserInterface";
import User from "../../models/user/user.models";

class UserDao {
  static async registerUser(user: UserModel) {
    try {
      const user_created = await User.create(user);
      return user_created;
    } catch (error: any) {
        throw new Error(`Internal Server Error: ${error?.message}`);
    }
  }

  static async loginUser(email: string, pass: string) {
    try {
      const userFinded: UserModel | any = await User.findOne({ email });

      return userFinded;
    } catch (error: any) {
        throw new Error(`Internal Server Error: ${error?.message}`);
    }
  }

  static async findOneUser(query={}) {
    try {
      const userFinded = await User.findOne(query);
        
      return userFinded;
    } catch (error: any) {
        return new Error(`Internal Server Error: ${error?.message}`);
    }
  }

  static async findUserByCart(cid: string) {
    try {
      const userFinded = await User.findOne({ cid });

      return userFinded;
    } catch (error: any) {
        throw new Error(`Internal Server Error: ${error?.message}`);
    }
  }

  static async findAndAsociateCart(id: string, cartId: string) {
    try {
      const result = await User.updateOne(
        { _id: id },
        { $set: { cid: cartId } }
      );

      return result;
    } catch (error: any) {
        throw new Error(`Internal Server Error: ${error?.message}`);
    }
  }
}

export default UserDao;