interface DocumentObject {
  name: string;
  reference: string;
}

export interface UserModel {
  _id: String ;
  first_name: string;
  last_name: string;
  email: String;
  cid: String;
  age: Number;
  role: string;
  documents: Array<DocumentObject>;
  password: string;
  last_connection: number;
}
