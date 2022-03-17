import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8080;
const MONGODB = process.env.MONGODB as string;

const config = { PORT, MONGODB };
export default config;
