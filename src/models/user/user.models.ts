import mongoose from 'mongoose';
import { UserModel } from '../../services/interfaces/UserInterface';

const Schema = mongoose.Schema;

const userSchema = new Schema<UserModel>({
  _id: { type: String, required: true },
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  documents: [{ name: String, reference: String }],
  age: Number,
  cid: { type: String },
  role: { type: String, default: 'USER', enum: ['USER', 'ADMIN', 'PREMIUM'] },
  password: String,
  last_connection: { type: Number }
}, { timestamps: true });

export default mongoose.model('User', userSchema);