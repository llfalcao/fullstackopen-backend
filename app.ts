import express, { ErrorRequestHandler } from 'express';
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
const mongoDbUrl = process.env.MONGODB as string;
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

const errorHandler: ErrorRequestHandler = (error, req, res) => {
  console.error(error);

  if (error.name === 'CastError') {
    if (error.path === '_id') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    return res.status(400).json({ error: error.message });
  }

  if (error.name === 'ValidationError') {
    const errors: { [key in string]: string } = {};
    Object.keys(error.errors).forEach(
      (key) => (errors[key] = error.errors[key].message),
    );
    return res.status(400).json(errors);
  }

  res.json('Something went wrong.');
};

app.use(errorHandler);
app.listen(port, () => console.log(`Server running on port ${port}`));
