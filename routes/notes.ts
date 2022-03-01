import { Router } from 'express';
import NoteInterface, { isNote } from '../models/Note';
import noteService from '../services/notes';

const router = Router();

// Get all notes
router.get('/', (req, res) =>
  noteService.read().then((notes) => res.json(notes))
);

// Get one note
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  noteService.read().then((notes) => {
    const note = notes.find((n) => n.id === Number(id));
    if (!note) return next();
    res.json(note);
  });
});

// Create note
router.post('/', async (req, res) => {
  const { content, important } = req.body;
  const notes = await noteService.read();
  const newNote: NoteInterface = {
    id: notes[notes.length - 1].id + 1,
    content,
    date: new Date().toUTCString(),
    important,
  };
  if (!isNote(newNote)) return res.sendStatus(400);
  await noteService.save(notes.concat(newNote));
  res.json(newNote);
});

// Delete note
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  noteService.read().then((notes) => {
    const filteredNotes = notes.filter((n) => n.id !== Number(id));
    if (filteredNotes.length === notes.length) {
      return res.sendStatus(404);
    }
    noteService.save(filteredNotes).then(() => res.sendStatus(204));
  });
});

export default router;
