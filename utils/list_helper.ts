import { Blog } from '../models/Blog';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummy = (blogs: Blog[]) => 1;

const totalLikes = (blogs: Blog[]) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs: Blog[]) =>
  blogs.reduce((fav, blog) => {
    if (blog.likes > fav.likes) {
      return blog;
    } else return fav;
  }, blogs[0]);

const listHelper = { dummy, favoriteBlog, totalLikes };
export default listHelper;
