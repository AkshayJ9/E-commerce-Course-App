// import dotenv from "dotenv";
// dotenv.config();

// const config = {
//   JWT_SECRET: process.env.JWT_USER_PASSWORD || "default_secret",
//   JWT_ADMIN_PASSWORD: process.env.JWT_ADMIN_PASSWORD,
// };

// const STRIPE_SECRET_KEY =
//   process.env.STRIPE_SECRET_KEY ||
//   "sk_test_51RNt5fE4RCy8eDH80LStB5YCbpP6BKvUkkWUe4Amy0XoZtclrjmTuR3RBlW3DGp2utGHmzwYvSRoBLbZmsWtvzQ000aYk7M0rc";

// export { config, STRIPE_SECRET_KEY };

// Backend/config.js

import dotenv from "dotenv";
dotenv.config();

const config = {
  JWT_SECRET: process.env.JWT_USER_PASSWORD || "default_secret",
  JWT_ADMIN_PASSWORD: process.env.JWT_ADMIN_PASSWORD || "admin_default_secret",
};

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY is not set in environment variables.");
}

export { config, STRIPE_SECRET_KEY };
