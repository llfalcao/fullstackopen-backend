import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app';
import listWithMultipleBlogs from '../db/blogs.json';
import { Blog, BlogModel } from '../models/Blog';
import { UserModel } from '../models/User';
import helper, {
  createUser,
  generateInvalidToken,
  generateToken,
  Login,
} from '../tests/test_helper';

interface Token {
  token: Token;
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
  await BlogModel.deleteMany({});

  await Promise.all(
    helper.initialBlogs.map(async (blog) => {
      await new BlogModel({ ...blog, user: user.id }).save();
    }),
  );
});

describe('when there is initially a list of blogs', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const contents = response.body.map((blog: Blog) => blog.title);
    expect(contents).toContain('React patterns');
  });

  test('the unique identifier is named "id"', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body[0].id).toBeDefined();
  });
});

describe('addition of a new blog', () => {
  let token: Token;

  beforeAll(async () => {
    token = await generateToken();
  });

  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).toContain('Canonical string reduction');
  });

  test('sets the "likes" count to zero by default if not specified', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    const lastAdded = blogsAtEnd[blogsAtEnd.length - 1];
    expect(lastAdded.likes).toEqual(0);
  });

  test('fails with status 401 with missing credentials', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    };
    await api.post('/api/blogs').send(newBlog).expect(401);
  });

  test('fails with status code 400 with invalid data', async () => {
    const newBlog = { author: 'Robert C. Martin' };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
});

describe('updating a blog', () => {
  let token: Token;

  beforeAll(async () => {
    token = await generateToken();
  });

  test('succeeds with a valid id and data', async () => {
    const blogs = await helper.blogsInDb();
    const newData = { likes: 50 };

    await api
      .put(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const modifiedBlog = blogsAtEnd.find((b) => b.id === blogs[0].id);
    expect(modifiedBlog?.likes).toBe(50);
  });

  test('fails with status code 400 with invalid id format', async () => {
    const newData = { likes: 3 };
    await api
      .put('/api/blogs/12345')
      .set('Authorization', `Bearer ${token}`)
      .send(newData)
      .expect(400);
  });

  test('fails with status 401 with missing credentials', async () => {
    const blogs = await helper.blogsInDb();
    const newData = { likes: 10 };
    await api.put(`/api/blogs/${blogs[0].id}`).send(newData).expect(401);
  });

  test('fails with status 401 with invalid credentials', async () => {
    const blogs = await helper.blogsInDb();
    const newData = { likes: 10 };
    const invalidToken = await generateInvalidToken();

    await api
      .put(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(newData)
      .expect(401);
  });

  test('fails with status code 404 if the blog is not found', async () => {
    const objectId = helper.generateObjectId();
    const newData = { likes: 2 };
    await api
      .put(`/api/blogs/${objectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData)
      .expect(404);
  });
});

describe('deleting a blog', () => {
  let token: Token;

  beforeAll(async () => {
    token = await generateToken();
  });

  test('succeeds with valid id', async () => {
    const blogs = await helper.blogsInDb();
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  test('fails with status 401 with missing credentials', async () => {
    const blogs = await helper.blogsInDb();
    await api.delete(`/api/blogs/${blogs[0].id}`).expect(401);
  });

  test('fails with status 401 with invalid credentials', async () => {
    const blogs = await helper.blogsInDb();
    const invalidToken = await generateInvalidToken();

    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);
  });

  test("fails with status code 404 when it's not found", async () => {
    const objectId = helper.generateObjectId();
    await api
      .delete(`/api/blogs/${objectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});

describe('total likes', () => {
  test('of one blog are equal to their like count', () => {
    const listWithOneBlog = [
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      },
    ];

    const result = helper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of multiple blogs', () => {
    const result = helper.totalLikes(listWithMultipleBlogs);
    expect(result).toBe(36);
  });
});

describe('blog stats', () => {
  test('favorite blog', () => {
    const result = helper.favoriteBlog(listWithMultipleBlogs);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 12,
      title: 'Canonical string reduction',
    });
  });

  test('most blogs', () => {
    const result = helper.mostBlogs(listWithMultipleBlogs);
    expect(result).toEqual({ name: 'Robert C. Martin', blogs: 3 });
  });

  test('most likes', () => {
    const result = helper.mostLikes(listWithMultipleBlogs);
    expect(result).toEqual({ name: 'Edsger W. Dijkstra', likes: 17 });
  });
});
