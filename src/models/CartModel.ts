export interface CartProduct {
    pid: string;
    quantity: number;
}

export interface CartModel {
    cid: string;
    products: Array<CartProduct>;
}