export interface UserModel {
  first_name: String;
  last_name: String;
  email: { type: String; unique: true };
  age: Number;
  role: String;
  password: String;
}
