import { validatePass } from "../../services/helpers/utils";
import { UserModel } from "../../services/interfaces/UserInterface";
import User from "../../models/user/user.models";

class UserController {
  static async registerUser(user: UserModel) {
    try {
        await User.create(user);
        
        return { status: 201, message: "Te has registrado correctamente." };
    } catch (error) {
        return { status: 500, message: "ocurrió un error al intentar registrar el usuario." };
    }
  }

  static async loginUser(email: string, pass: string) {
    const userFinded: UserModel | any = await User.findOne({ email: email });
    console.log(pass, userFinded.password)
    const isValidPassword = validatePass(pass, userFinded);

    if(!isValidPassword){
        return { status: 400, message: "La contraseña o correo son invalidos." };
    }

    return { status: 200, userFinded };
  }
}

export default UserController;