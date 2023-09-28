class Product {
  private _id: number;
  private _title: string;
  private _description: string;
  private _price: number;
  private _thumbnail: string;
  private _code: string;
  private _stock: number;

  constructor(
    id: number,
    title: string,
    description: string,
    price: number,
    thumbnail: string,
    code: string,
    stock: number
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._price = price;
    this._thumbnail = thumbnail;
    this._code = code;
    this._stock = stock;
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get thumbnail(): string {
    return this._thumbnail;
  }

  get code(): string {
    return this._code;
  }

  get stock(): number {
    return this._stock;
  }
}

export default Product;
