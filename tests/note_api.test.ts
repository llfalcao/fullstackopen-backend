import supertest from 'supertest';
import app from '../app';
import { Note, NoteModel } from '../models/Note';

const api = supertest(app);

const initialNotes: Note[] = [
  {
    content: 'HTML is easy',
    date: new Date().toUTCString(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date().toUTCString(),
    important: true,
  },
];

beforeEach(async () => {
  await NoteModel.deleteMany({});
  for await (const note of initialNotes) {
    const noteObject = new NoteModel(note);
    noteObject.save();
  }
});

test('notes are returned from json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');
  const contents = response.body.map((r: Note) => r.content);
  expect(contents).toContain('HTML is easy');
});

test('a valid note can be added', async () => {
  const newNote = { content: 'Rage, my soldiers!', important: true };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/notes');
  const contents = response.body.map((r: Note) => r.content);

  expect(response.body).toHaveLength(initialNotes.length + 1);
  expect(contents).toContain('Rage, my soldiers!');
});
