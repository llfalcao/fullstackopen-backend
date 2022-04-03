import supertest from 'supertest';
import 'express-async-errors';
import app from '../app';
import { Note, NoteModel } from '../models/Note';
import helper from './test_helper';

const api = supertest(app);

beforeEach(async () => {
  await NoteModel.deleteMany({});
  const noteObjects = helper.initialNotes.map((note) => new NoteModel(note));
  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);
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

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb();
  expect(notesAtStart).toHaveLength(helper.initialNotes.length);

  const noteToView = notesAtStart[0];
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
  expect(resultNote.body).toEqual(processedNoteToView);
});
