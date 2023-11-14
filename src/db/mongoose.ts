import mongoose from 'mongoose';

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const database = "ecommerce";

const URI=`mongodb+srv://${USER}:${PASSWORD}@cluster0.khrlasb.mongodb.net/${database}`;

export const init = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Database conected 🚀');
  } catch (error) {
    console.log('Ah ocurrido un error al intentar conectarnos a la DB', error);
  }
}

export default URI;