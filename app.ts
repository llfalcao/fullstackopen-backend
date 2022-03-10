import express, { ErrorRequestHandler, response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connect } from 'mongoose';
import notesRouter from './routes/notes';
import personRouter from './routes/persons';
import infoRouter from './routes/info';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 8080;
const mongoDbUrl = process.env.MONGODB!;
connect(mongoDbUrl).catch((error) => console.log(error));

app.use(cors());
app.use(express.json());

morgan.token('body', (req: express.Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status - :response-time ms :body'));

app.get('/', (req, res) => res.send('Homepage'));
app.use('/info', infoRouter);
app.use('/api/notes', notesRouter);
app.use('/api/persons', personRouter);
app.use((req, res) => res.sendStatus(404));

// Error handler
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Invalid ID format' });
  }
};

app.use(errorHandler);
app.listen(port, () => console.log(`Server running on port ${port}`));
