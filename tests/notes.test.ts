import supertest from 'supertest';
import app from '../app';
import { Note, NoteModel } from '../models/Note';
import helper from './test_helper';

const api = supertest(app);

beforeEach(async () => {
  await NoteModel.deleteMany({});

  for await (const note of helper.initialNotes) {
    await new NoteModel(note).save();
  }
});

describe('when there are initially notes saved', () => {
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
});

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
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

  test('fails with status code 400 if the data is invalid', async () => {
    const newNote = { content: '', important: true };
    await api.post('/api/notes').send(newNote).expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
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

  test('fails with status code 404 if the note is not found', async () => {
    const objectId = helper.generateObjectId();
    await api.get(`/api/notes/${objectId}`).expect(404);
  });

  test('fails with status code 400 if the id is invalid', async () => {
    await api.get('/api/notes/123').expect(400);
  });
});
