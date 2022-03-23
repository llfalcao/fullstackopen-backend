import { Blog } from '../models/Blog';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummy = (blogs: Blog[]) => 1;

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

const listHelper = { dummy, favoriteBlog, mostBlogs, mostLikes, totalLikes };
export default listHelper;
