import { Router } from 'express';
import { Note, isNote, NoteModel } from '../models/Note';
import { HydratedDocument } from 'mongoose';
import noteService from '../services/notes';

const router = Router();

// Get all notes
router.get('/', (req, res) =>
  noteService.getAll().then((notes) => res.json(notes)),
);

// Get one note
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  noteService
    .get(id)
    .then((note) => {
      if (!note) {
        return res.sendStatus(404);
      }
      res.json(note);
    })
    .catch((error) => next(error));
});

// Create note
router.post('/', (req, res) => {
  const { content, important } = req.body;

  if (!content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  if (!isNote({ content, important })) {
    return res.status(400).json({ error: 'invalid value type' });
  }

  noteService
    .create({ content, important })
    .then((createdNote) => res.json(createdNote));
});

// Update note
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { content, important } = req.body;

  noteService
    .update(id, { content, important })
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

// Delete note
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  noteService
    .remove(id)
    .then((result) => {
      if (!result) return res.sendStatus(404);
      res.json(204);
    })
    .catch((error) => next(error));
});

export default router;
