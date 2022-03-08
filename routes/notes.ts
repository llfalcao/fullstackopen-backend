import { Router } from 'express';
import { Note, isNote, NoteModel } from '../models/Note';
import { HydratedDocument, isValidObjectId } from 'mongoose';
import noteService from '../services/notes';

const router = Router();

// Get all notes
router.get('/', (req, res) =>
  noteService.getAll().then((notes) => res.json(notes)),
);

// Get one note
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.sendStatus(404);
  }

  noteService.get(id).then((note) => res.json(note));
});

// Create note
router.post('/', (req, res) => {
  const { body } = req;

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const note: HydratedDocument<Note> = new NoteModel({
    content: body.content,
    date: new Date(),
    important: body.important,
  });

  if (!isNote(note)) {
    return res.sendStatus(400);
  }

  noteService.create(note).then((createdNote) => res.json(createdNote));
});

// Update note
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { content, important } = req.body;

  if (!isValidObjectId(id)) {
    return res.sendStatus(404);
  }

  noteService
    .update(id, { content, important })
    .then((updatedNote) => res.json(updatedNote));
});

// Delete note
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.sendStatus(404);
  }

  noteService.remove(id).then((result) => {
    if (!result) return res.sendStatus(404);
    res.json(204);
  });
});

export default router;
