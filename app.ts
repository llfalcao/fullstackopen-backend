import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { connect } from 'mongoose';
import noteRouter from './controllers/notes';
import personRouter from './controllers/persons';
import blogRouter from './controllers/blog';
import config from './utils/config';
import middlewares from './utils/middlewares';
import logger from './utils/logger';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

connect(config.MONGODB)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.error('Error connecting to MongoDB', error.message));

app.use(cors());
app.use(express.json());
app.use(middlewares.requestLogger);

app.use('/api/notes', noteRouter);
app.use('/api/persons', personRouter);
app.use('/api/blogs', blogRouter);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

export default app;
