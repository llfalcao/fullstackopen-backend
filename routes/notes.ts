import { Router } from 'express';
import NoteInterface, { isNote } from '../models/Note';
import noteService from '../services/notes';

const router = Router();

// Get all notes
router.get('/', (req, res) =>
  noteService.read().then((notes) => res.json(notes)),
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
router.post('/', (req, res) => {
  const { content, important } = req.body;
  noteService.read().then((notes) => {
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
    const newNote: NoteInterface = {
      id: maxId + 1,
      date: new Date().toUTCString(),
      content,
      important,
    };
    if (!isNote(newNote)) return res.sendStatus(400);
    noteService.save(notes.concat(newNote)).then(() => res.json(newNote));
  });
});

// Update note
router.put('/:id', (req, res) => {
  const { id } = req.params;
  noteService.read().then((notes) => {
    const index = notes.findIndex((n) => n.id === Number(id));
    if (!notes[index]) return res.sendStatus(404);
    notes[index] = { ...notes[index], important: !notes[index].important };
    noteService.save(notes).then(() => res.json(notes[index]));
  });
});

// Delete note
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  noteService.read().then((notes) => {
    const filteredNotes = notes.filter((n) => n.id !== Number(id));
    noteService.save(filteredNotes).then(() => res.sendStatus(204));
  });
});

export default router;
