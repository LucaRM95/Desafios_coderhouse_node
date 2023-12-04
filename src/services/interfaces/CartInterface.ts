export interface CartProduct {
    pid: String;
    quantity: Number;
}

export interface CartModel {
    _id: { type: String, required: true };
    uid: { type: String },
    products: Array<CartProduct>;
}