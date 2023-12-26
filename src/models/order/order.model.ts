import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema({
    _id: { type: String, required: true },
    code: { type: String, unique: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    status: { type: String, default: 'PENDING', enum: ['PENDING', 'COMPLETED', 'CANCELLED'] },
}, { timestamps: true });

export default mongoose.model('Orders', orderSchema);