import { Blog, BlogModel } from '../models/Blog';
import { Note, NoteModel } from '../models/Note';
import { Types } from 'mongoose';

const initialBlogs: Blog[] = [
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

const initialNotes: Note[] = [
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

const totalLikes = (blogs: Blog[]) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs: Blog[]) => {
  const favorite = blogs.reduce(
    (fav, blog) => (blog.likes > fav.likes ? blog : fav),
    blogs[0],
  );

  const { title, author, likes } = favorite;
  return { title, author, likes };
};

const mostBlogs = (blogs: Blog[]) => {
  const ranking = blogs.reduce((ranking, blog) => {
    const i = ranking.findIndex((author) => author.name === blog.author);

    if (i === -1) {
      ranking.push({ name: blog.author, blogs: 1 });
    } else {
      ranking[i] = { ...ranking[i], blogs: ranking[i].blogs + 1 };
    }

    return ranking;
  }, <{ name: string; blogs: number }[]>[]);

  return ranking.reduce(
    (topAuthor, author) =>
      author.blogs > topAuthor.blogs ? author : topAuthor,
    ranking[0],
  );
};

const mostLikes = (blogs: Blog[]) => {
  const ranking = blogs.reduce((ranking, blog) => {
    const i = ranking.findIndex((author) => author.name === blog.author);

    if (i === -1) {
      ranking.push({ name: blog.author, likes: blog.likes });
    } else {
      ranking[i] = { ...ranking[i], likes: ranking[i].likes + blog.likes };
    }

    return ranking;
  }, <{ name: string; likes: number }[]>[]);

  return ranking.reduce(
    (topAuthor, author) =>
      author.likes > topAuthor.likes ? author : topAuthor,
    ranking[0],
  );
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
};

export default helper;
