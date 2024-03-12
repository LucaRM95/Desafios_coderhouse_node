import dotenv from "dotenv";

dotenv.config();

export default {
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  URI: process.env.URI,
  PORT: process.env.PORT,
  STRIPE_SECRET: process.env.STRIPE_SECRET,
  URL: process.env.URL,
  mail: {
    service: process.env.EMAIL_SERVICE || "gmail",
    port: process.env.EMAIL_PORT || 587,
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_PASS,
  },
};
