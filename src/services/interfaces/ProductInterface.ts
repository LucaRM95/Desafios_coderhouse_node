export interface ProductModel {
  _id: string;
  code: string;
  owner: string;
  status: boolean;
  title: string;
  description: string;
  category: string;
  thumbnail: Array<string>;
  price: number;
  stock: number;
}
