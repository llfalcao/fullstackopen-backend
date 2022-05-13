import { Router } from 'express';
import { Blog, BlogModel } from '../models/Blog';
import { HydratedDocument } from 'mongoose';
import { UserModel } from '../models/User';

const blogsRouter = Router();

// Get all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await BlogModel.find({}).populate('user', { notes: 0 });
  res.json(blogs);
});

// Create blog
blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const user = await UserModel.findOne();
  const blog: HydratedDocument<Blog> = new BlogModel({
    title,
    author,
    url,
    likes,
    user: user._id,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
});

// Update blog
blogsRouter.put('/:id', async (req, res) => {
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
blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deletedBlog = await BlogModel.findByIdAndDelete(id);
  deletedBlog ? res.sendStatus(204) : res.sendStatus(404);
});

export default blogsRouter;
