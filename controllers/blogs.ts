import { Router } from 'express';
import { Blog, BlogModel } from '../models/Blog';
import { HydratedDocument } from 'mongoose';

const blogRouter = Router();

// Get all blogs
blogRouter.get('/', async (req, res) => {
  const blogs = await BlogModel.find({});
  res.json(blogs);
});

// Create blog
blogRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;

  const blog: HydratedDocument<Blog> = new BlogModel({
    title,
    author,
    url,
    likes,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
});

export default blogRouter;
