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

// Update blog
blogRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, url, likes } = req.body;

  const updatedBlog = await BlogModel.findByIdAndUpdate(
    id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' },
  );

  updatedBlog ? res.json(updatedBlog) : res.sendStatus(404);
});

// Delete blog
blogRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deletedBlog = await BlogModel.findByIdAndDelete(id);
  deletedBlog ? res.sendStatus(204) : res.sendStatus(404);
});

export default blogRouter;
