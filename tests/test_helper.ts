import bcrypt from 'bcrypt';
import { BlogModel } from '../models/Blog';
import { NoteModel } from '../models/Note';
import { UserModel } from '../models/User';
import { Types } from 'mongoose';
import supertest from 'supertest';
import app from '../app';

interface LocalBlog {
  url: string;
  title: string;
  author: string;
  likes: number;
}

interface LocalNote {
  content: string;
  date: Date;
  important: boolean;
}

const initialBlogs: LocalBlog[] = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
];

const initialNotes: LocalNote[] = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
];

const generateObjectId = () => new Types.ObjectId().toString();

const notesInDb = async () => {
  const notes = await NoteModel.find({});
  return notes.map((note) => note.toJSON());
};

const blogsInDb = async () => {
  const blogs = await BlogModel.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await UserModel.find({});
  return users.map((user) => user.toJSON());
};

const totalLikes = (blogs: LocalBlog[]) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs: LocalBlog[]) => {
  const favorite = blogs.reduce(
    (fav, blog) => (blog.likes > fav.likes ? blog : fav),
    blogs[0],
  );

  const { title, author, likes } = favorite;
  return { title, author, likes };
};

const mostBlogs = (blogs: LocalBlog[]) => {
  const ranking = blogs.reduce(
    (ranking, blog) => {
      const i = ranking.findIndex((author) => author.name === blog.author);

      if (i === -1) {
        ranking.push({ name: blog.author, blogs: 1 });
      } else {
        ranking[i] = { ...ranking[i], blogs: ranking[i].blogs + 1 };
      }

      return ranking;
    },
    <{ name: string; blogs: number }[]>[],
  );

  return ranking.reduce(
    (topAuthor, author) =>
      author.blogs > topAuthor.blogs ? author : topAuthor,
    ranking[0],
  );
};

const mostLikes = (blogs: LocalBlog[]) => {
  const ranking = blogs.reduce(
    (ranking, blog) => {
      const i = ranking.findIndex((author) => author.name === blog.author);

      if (i === -1) {
        ranking.push({ name: blog.author, likes: blog.likes });
      } else {
        ranking[i] = { ...ranking[i], likes: ranking[i].likes + blog.likes };
      }

      return ranking;
    },
    <{ name: string; likes: number }[]>[],
  );

  return ranking.reduce(
    (topAuthor, author) =>
      author.likes > topAuthor.likes ? author : topAuthor,
    ranking[0],
  );
};

export interface Login {
  username: string;
  password: string;
}

const login = async ({ username, password }: Login) => {
  const response = await supertest(app)
    .post('/api/login')
    .send({ username, password });

  return response;
};

const DEFAULT_TEST_LOGIN = { username: 'root', password: 'onlyYmirKnows' };
export const generateToken = async ({
  username,
  password,
} = DEFAULT_TEST_LOGIN) => {
  const response = await login({ username, password });
  return response.body.token;
};

export const createUser = async ({ username, password }: Login) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new UserModel({ username, passwordHash });
  await user.save();
  return { id: user._id, username, password };
};

export const generateInvalidToken = async () => {
  const username = 'hacking';
  const password = 'toTheGate';
  await createUser({ username, password });

  const response = await supertest(app)
    .post('/api/login')
    .send({ username, password });

  return response.body.token;
};

const helper = {
  blogsInDb,
  favoriteBlog,
  generateObjectId,
  initialBlogs,
  initialNotes,
  mostBlogs,
  mostLikes,
  notesInDb,
  totalLikes,
  usersInDb,
  login,
  generateToken,
  generateInvalidToken,
};

export default helper;
