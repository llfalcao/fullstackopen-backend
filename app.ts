import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { connect } from 'mongoose';
import notesRouter from './controllers/notes';
import personsRouter from './controllers/persons';
import blogsRouter from './controllers/blogs';
import usersRouter from './controllers/users';
import loginRouter from './controllers/login';
import config from './utils/config';
import middlewares from './utils/middlewares';
import logger from './utils/logger';

const app = express();

connect(config.MONGODB)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.error('Error connecting to MongoDB', error.message));

app.use(cors());
app.use(express.json());
app.use(middlewares.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/notes', notesRouter);
app.use('/api/persons', personsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

export default app;
