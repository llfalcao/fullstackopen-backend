import supertest from 'supertest';
import app from '../app';

const api = supertest(app);

test('notes are returned from json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});
