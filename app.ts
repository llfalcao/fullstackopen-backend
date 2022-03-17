import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import notesRouter from './controllers/notes';
import personRouter from './controllers/persons';
import infoRouter from './controllers/info';
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

app.get('/', (req, res) => res.send('Home'));
app.use('/info', infoRouter);
app.use('/api/notes', notesRouter);
app.use('/api/persons', personRouter);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

export default app;
