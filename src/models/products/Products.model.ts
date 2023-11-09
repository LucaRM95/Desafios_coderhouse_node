import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { ProductModel } from "../../interfaces/ProductModel";

const Schema = mongoose.Schema;

const productModel = new Schema({
    _id: { type: String, required: true },
    code: String,
    status: Boolean,
    title: String,
    description: String,
    category: String,
    thumbnail: Array<String>,
    price: Number,
    stock: Number,
});

productModel.plugin(mongoosePaginate);

const Product = mongoose.model<ProductModel, PaginateModel<ProductModel>>('Product', productModel);

export default Product;