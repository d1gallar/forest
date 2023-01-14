import * as dotenv from "dotenv";
dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
const JWT_SALT_ROUNDS = +(process.env.JWT_SALT_ROUNDS as string);
const BCRYPT_SALT_ROUNDS = +(process.env.BCRYPT_SALT_ROUNDS as string);
const BASE_URL = process.env.BASE_URL;
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.tantehd.mongodb.net/shop`;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPATE_ID || "";
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "";
const STRIPE_SECRET = process.env.STRIPE_SECRET || "";
const STRIPE_PUBLISHABLE = process.env.STRIPE_PUBLISHABLE || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

const SERVER_PORT = process.env.SERVER_PORT;

const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
    baseUrl: BASE_URL
  },
  jwt: {
    accessSecret: JWT_ACCESS_SECRET,
    refreshSecret: JWT_REFRESH_SECRET,
    saltRounds: JWT_SALT_ROUNDS
  },
  bcrypt: {
    saltRounds: BCRYPT_SALT_ROUNDS
  },
  emailjs: {
    templateId: EMAILJS_TEMPLATE_ID,
    serviceId: EMAILJS_SERVICE_ID,
    publicKey: EMAILJS_PUBLIC_KEY
  },
  stripe :{
    secret: STRIPE_SECRET,
    publishable: STRIPE_PUBLISHABLE,
    webhook: STRIPE_WEBHOOK_SECRET
  }
};

export default config;
