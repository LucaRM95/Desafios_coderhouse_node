import mongoose from "mongoose";
import { CartModel } from "../../services/interfaces/CartInterface";

const Schema = mongoose.Schema;

const cartSchema = new Schema<CartModel>({
  _id: { type: String, required: true },
  products: [{
    pid: String,
    quantity: Number
  }],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;