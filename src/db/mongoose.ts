import mongoose from 'mongoose';
import env from '../services/config/dotenv.config'

const URI=env.URI || "";

export const init = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Database conected 🚀');
  } catch (error) {
    console.log('Ha ocurrido un error al intentar conectarnos a la DB', error);
  }
}

export default URI;