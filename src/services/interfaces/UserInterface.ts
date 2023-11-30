export interface UserModel {
  _id: { tpye: String, required: true };
  first_name: string;
  last_name: string;
  email: { type: String; unique: true };
  cart: Number;
  age: Number;
  role: string;
  password: string;
}
