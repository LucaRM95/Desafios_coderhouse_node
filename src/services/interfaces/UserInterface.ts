export interface UserModel {
  _id: { tpye: String, required: true, unique: true };
  first_name: string;
  last_name: string;
  email: { type: String; unique: true };
  cid: { type: String };
  age: Number;
  role: string;
  password: string;
}
