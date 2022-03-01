import express from 'express';
import cors from 'cors';
import notesRouter from './routes/notes';
import personRouter from './routes/persons';
import infoRouter from './routes/info';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Homepage'));
app.use('/info', infoRouter);
app.use('/api/notes', notesRouter);
app.use('/api/persons', personRouter);
app.get('*', (req, res) => res.sendStatus(404));

app.listen(port, () => console.log(`Server running on port ${port}`));
