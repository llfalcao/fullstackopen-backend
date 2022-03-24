import dotenv from 'dotenv';
dotenv.config();

declare const process: {
  env: {
    NODE_ENV: string;
    MONGODB_URI: string;
    TEST_MONGODB_URI: string;
    PORT: number;
  };
};

const PORT = process.env.PORT || 8080;
const MONGODB =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const config = { PORT, MONGODB };
export default config;
