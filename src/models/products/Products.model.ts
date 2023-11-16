import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { ProductModel } from "../../services/interfaces/ProductInterface";

const Schema = mongoose.Schema;

const productSchema = new Schema({
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

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model<ProductModel, PaginateModel<ProductModel>>('Product', productSchema);

export default Product;