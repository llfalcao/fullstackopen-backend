import { Blog } from '../models/Blog';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummy = (blogs: Blog[]) => 1;

const totalLikes = (blogs: Blog[]) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0);

const listHelper = { dummy, totalLikes };
export default listHelper;
