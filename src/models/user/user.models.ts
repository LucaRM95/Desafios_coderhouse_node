import mongoose from 'mongoose';
import { UserModel } from '../../services/interfaces/UserInterface';

const Schema = mongoose.Schema;

const userSchema = new Schema<UserModel>({
  _id: { type: String, required: true },
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  cid: { type: String },
  role: { type: String, default: 'USER', enum: ['USER', 'ADMIN', 'PREMIUM'] },
  password: String,
}, { timestamps: true });

export default mongoose.model('User', userSchema);