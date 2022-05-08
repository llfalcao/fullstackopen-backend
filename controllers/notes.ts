import { Router } from 'express';
import { NoteModel } from '../models/Note';
import { UserModel } from '../models/User';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

declare const process: {
  env: {
    SECRET: string;
  };
};

const notesRouter = Router();

// Get all notes
notesRouter.get('/', async (req, res) => {
  const notes = await NoteModel.find({}).populate('user', {
    username: 1,
    name: 1,
  });

  res.json(notes);
});

// Get one note
notesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const note = await NoteModel.findById(id);
  note ? res.json(note) : res.sendStatus(404);
});

// Get authorization
const getTokenFrom = (request: Request) => {
  const authorization = request.headers.authorization;
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// Create note
notesRouter.post('/', async (req, res) => {
  const { content, important } = req.body;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = getTokenFrom(req);
  if (!token) {
    return res.status(401).json({ error: 'Token is missing or invalid' });
  }

  console.log(token);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodedToken: any = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'Token is missing or invalid' });
  }

  const user = await UserModel.findById(decodedToken.id);
  const note = new NoteModel({
    content,
    important,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  res.status(201).json(savedNote);
});

// Update note
notesRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, important } = req.body;

  const updatedNote = await NoteModel.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: 'query' },
  );

  res.json(updatedNote);
});

// Delete note
notesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deletedNote = await NoteModel.findByIdAndDelete(id);
  deletedNote ? res.sendStatus(204) : res.sendStatus(404);
});

export default notesRouter;
