import { Router } from 'express';
import { Note, NoteModel } from '../models/Note';
import { HydratedDocument } from 'mongoose';

const noteRouter = Router();

// Get all notes
noteRouter.get('/', (req, res) =>
  NoteModel.find({}).then((notes) => res.json(notes)),
);

// Get one note
noteRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;

  NoteModel.findById(id)
    .then((note) => (note ? res.json(note) : res.sendStatus(404)))
    .catch((error) => next(error));
});

// Create note
noteRouter.post('/', (req, res, next) => {
  const { content, important } = req.body;

  const note: HydratedDocument<Note> = new NoteModel({
    date: new Date(),
    content,
    important,
  });

  note
    .save()
    .then((createdNote) => res.status(201).json(createdNote))
    .catch((error) => next(error));
});

// Update note
noteRouter.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { content, important } = req.body;

  NoteModel.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

// Delete note
noteRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  NoteModel.findByIdAndDelete(id)
    .then((note) => (note ? res.sendStatus(204) : res.sendStatus(404)))
    .catch((error) => next(error));
});

export default noteRouter;
