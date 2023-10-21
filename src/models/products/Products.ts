import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productModel = new Schema({
    _id: String,
    code: String,
    status: Boolean,
    title: String,
    description: String,
    category: String,
    thumbnail: Array<String>,
    price: Number,
    stock: Number,
});

const Product = mongoose.model('Product', productModel);

export default Product;