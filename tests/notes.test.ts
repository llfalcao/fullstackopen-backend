import supertest from 'supertest';
import app from '../app';
import { Note, NoteModel } from '../models/Note';
import helper from './test_helper';

const api = supertest(app);

beforeEach(async () => {
  await NoteModel.deleteMany({});

  for await (const note of helper.initialNotes) {
    new NoteModel(note).save();
  }
});

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
  const response = await api.get('/api/notes');
  expect(response.body).toHaveLength(helper.initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');
  const contents = response.body.map((r: Note) => r.content);
  expect(contents).toContain('HTML is easy');
});

test('a valid note can be added', async () => {
  const newNote = { content: 'My soldiers, rage!', important: true };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

  const contents = notesAtEnd.map((n) => n.content);
  expect(contents).toContain('My soldiers, rage!');
});

test('note without content is not added', async () => {
  const newNote = { content: '', important: true };
  await api.post('/api/notes').send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});
