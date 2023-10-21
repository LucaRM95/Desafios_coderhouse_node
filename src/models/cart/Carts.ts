import mongoose from "mongoose";
import { CartProduct } from "../../interfaces/CartModel";

const Schema = mongoose.Schema;

const cartModel = new Schema({
    _id: String,
    products: Array<CartProduct>,
});

const Cart = mongoose.model('Cart', cartModel);

export default Cart;