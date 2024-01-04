import { Router } from 'express';
import { NoteModel } from '../models/Note';
import { UserModel } from '../models/User';
import middlewares from '../utils/middlewares';

const notesRouter = Router();

// Get all notes
notesRouter.get('/', async (_req, res) => {
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

// Create note
notesRouter.post('/', middlewares.userExtractor, async (req, res) => {
  const { content, important } = req.body;
  const { user } = req;
  const userData = await UserModel.findById(user.id);

  if (!userData) {
    return res.status(404).json({ error: 'User not found' });
  }

  const note = new NoteModel({
    content,
    important,
    date: new Date(),
    user: userData?._id,
  });

  const savedNote = await note.save();
  userData.notes = userData.notes.concat(savedNote);
  await userData.save();

  res.status(201).json(savedNote);
});

// Update note
notesRouter.put('/:id', middlewares.userExtractor, async (req, res) => {
  const { id } = req.params;
  const { content, important } = req.body;
  const { user } = req;
  const note = await NoteModel.findById(id, 'user');
  const userId = note?.user.toString();

  if (note && userId !== user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const updatedNote = await NoteModel.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: 'query' },
  );

  res.json(updatedNote);
});

// Delete note
notesRouter.delete('/:id', middlewares.userExtractor, async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const note = await NoteModel.findById(id, 'user');
  const userId = note?.user.toString();

  if (note && userId !== user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const deletedNote = await NoteModel.findByIdAndDelete(id);
  deletedNote ? res.sendStatus(204) : res.sendStatus(404);
});

export default notesRouter;
