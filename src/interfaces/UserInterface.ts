export interface UserModel {
  first_name: string;
  last_name: string;
  email: { type: String; unique: true };
  age: Number;
  role: string;
  password: string;
}
