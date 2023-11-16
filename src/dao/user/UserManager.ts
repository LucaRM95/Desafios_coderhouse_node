import { validatePass } from "../../helpers/utils";
import { UserModel } from "../../interfaces/UserInterface";
import User from "../../models/user/user.models";

class UserManager {
    static async registerUser(user: UserModel){
        
    }

    static async loginUser(email: string, pass: string, user: UserModel){
        const userFinded: UserModel | any = await User.findOne({ email: email });
        const isValidPassword = validatePass(pass, user);
    }
}