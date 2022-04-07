import { Router } from 'express';
import { Note, NoteModel } from '../models/Note';
import { HydratedDocument } from 'mongoose';

const notesRouter = Router();

// Get all notes
notesRouter.get('/', async (req, res) => {
  const notes = await NoteModel.find({});
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
  const { content, important } = req.body;

  const note: HydratedDocument<Note> = new NoteModel({
    date: new Date(),
    content,
    important,
  });

  const createdNote = await note.save();
  res.status(201).json(createdNote);
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
