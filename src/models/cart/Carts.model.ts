import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartModel = new Schema({
  _id: { type: String, required: true },
  products: [{
    pid: String,
    quantity: Number
  }],
});

const Cart = mongoose.model("Cart", cartModel);

export default Cart;