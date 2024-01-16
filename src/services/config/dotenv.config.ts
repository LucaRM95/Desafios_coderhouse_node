import dotenv from "dotenv";

dotenv.config();

export default {
    ENV: process.env.ENV || 'DEV',
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    URI: process.env.URI,
    PORT: process.env.PORT
}