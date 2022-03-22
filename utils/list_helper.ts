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
  const ranking: { name: string; count: number }[] = [];

  blogs.forEach((blog) => {
    const index = ranking.findIndex((a) => a.name === blog.author);
    if (index === -1) {
      ranking.push({ name: blog.author, count: 1 });
    } else {
      ranking[index] = { ...ranking[index], count: ranking[index].count + 1 };
    }
  });

  return ranking.reduce(
    (top, author) => (author.count > top.count ? author : top),
    ranking[0],
  );
};

const listHelper = { dummy, favoriteBlog, mostBlogs, totalLikes };
export default listHelper;
