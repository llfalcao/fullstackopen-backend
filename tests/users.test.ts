import supertest from 'supertest';
import app from '../app';
import { UserModel } from '../models/User';
import helper from './test_helper';

const api = supertest(app);

beforeEach(async () => {
  await UserModel.deleteMany({});
});

test('creates a new user', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'dpyx',
    name: 'Pyxis',
    password: 'marleyanWine',
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

  const usernames = usersAtEnd.map((user) => user.username);
  expect(usernames).toContain(newUser.username);
});
