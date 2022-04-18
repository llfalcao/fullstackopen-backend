import { Router } from 'express';
import { NoteModel } from '../models/Note';
import { UserModel } from '../models/User';

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

// Create note
notesRouter.post('/', async (req, res) => {
  const { content, important, userId } = req.body;
  const user = await UserModel.findById(userId);

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
