import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGODB!;
connect(url, () => console.log('connected'));

const db = connection;
export default db;
