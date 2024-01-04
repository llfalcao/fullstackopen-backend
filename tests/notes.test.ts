import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app';
import { Note, NoteModel } from '../models/Note';
import { UserModel } from '../models/User';
import helper, {
  createUser,
  generateInvalidToken,
  generateToken,
  Login,
} from './test_helper';

interface Token {
  token: string;
  username: string;
  name?: string;
}

interface User extends Login {
  id: mongoose.Types.ObjectId;
}

const api = supertest(app);
let user: User;

beforeAll(async () => {
  await UserModel.deleteMany({});
  user = await createUser({
    username: 'root',
    password: 'onlyYmirKnows',
  });
});

beforeEach(async () => {
  await NoteModel.deleteMany({});

  await Promise.all(
    helper.initialNotes.map(async (note) => {
      await new NoteModel({ ...note, user: user.id }).save();
    }),
  );
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
  let token: Token;

  beforeAll(async () => {
    token = await generateToken();
  });

  test('succeeds with valid data', async () => {
    const newNote = { content: 'My soldiers, rage!', important: true };

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
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
    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(newNote)
      .expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });

  test('fails with status 401 with missing credentials', async () => {
    const newNote = { content: 'My soldiers, rage!', important: true };
    await api.post('/api/notes').send(newNote).expect(401);
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

describe('updating a note', () => {
  let token: Token;

  beforeAll(async () => {
    token = await generateToken();
  });

  test('succeeds with valid id and data', async () => {
    const notes = await helper.notesInDb();
    const newData = { content: 'new content' };

    await api
      .put(`/api/notes/${notes[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with status code 400 with invalid id format', async () => {
    const newData = { content: 'updated content' };
    await api
      .put('/api/notes/12345')
      .set('Authorization', `Bearer ${token}`)
      .send(newData)
      .expect(400);
  });

  test('fails with status 401 with missing credentials', async () => {
    const notes = await helper.notesInDb();
    const newData = { content: 'updated content' };
    await api.put(`/api/notes/${notes[0].id}`).send(newData).expect(401);
  });

  test('fails with status 401 with invalid credentials', async () => {
    const notes = await helper.notesInDb();
    const newData = { likes: 10 };
    const invalidToken = await generateInvalidToken();

    await api
      .put(`/api/notes/${notes[0].id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(newData)
      .expect(401);
  });
});
