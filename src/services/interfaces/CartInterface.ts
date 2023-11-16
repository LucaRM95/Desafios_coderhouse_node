export interface CartProduct {
    pid: String;
    quantity: Number;
}

export interface CartModel {
    _id: { type: String, required: true };
    products: Array<CartProduct>;
}