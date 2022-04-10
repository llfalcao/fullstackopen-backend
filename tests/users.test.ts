import bcrypt from 'bcrypt';
import supertest from 'supertest';
import app from '../app';
import { UserModel } from '../models/User';
import helper from './test_helper';

const api = supertest(app);

beforeEach(async () => {
  await UserModel.deleteMany({});

  const passwordHash = await bcrypt.hash('onlyYmirKnows', 10);
  const user = new UserModel({ username: 'root', passwordHash });

  await user.save();
});

describe('creation of a new user', () => {
  test('succeeds with valid data', async () => {
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

  test('fails with status code 400 if the username already exists', async () => {
    const newUser = {
      username: 'root',
      name: 'Pyxis',
      password: 'marleyanWine',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});
