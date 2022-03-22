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

const listHelper = { dummy, favoriteBlog, totalLikes };
export default listHelper;
