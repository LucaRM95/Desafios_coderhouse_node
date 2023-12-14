import { UserModel } from "../../services/interfaces/UserInterface";
import User from "../../models/user/user.models";

class UserDao {
  static get(filter_query: any = {}, criteria: any = {}) {
    return User.find(filter_query, criteria);
  }

  static create(user: UserModel) {
    return User.create(user);
  }

  static update(filter_query: any, criteria: any) {
    return User.updateOne(filter_query, criteria);
  }

  static delete(id: string) {
    return User.deleteOne({ _id: id });
  }
}

export default UserDao;