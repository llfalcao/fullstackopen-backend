import { Router } from 'express';
import { Blog, BlogModel } from '../models/Blog';
import { HydratedDocument } from 'mongoose';
import { UserModel } from '../models/User';
import middlewares from '../utils/middlewares';

const blogsRouter = Router();

// Get all blogs
blogsRouter.get('/', async (_req, res) => {
  const blogs = await BlogModel.find({}).populate('user', {
    notes: 0,
    blogs: 0,
  });

  res.json(blogs);
});

// Create blog
blogsRouter.post('/', middlewares.userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body;
  const { user } = req;

  const userData = await UserModel.findById(user?.id);

  if (!userData) {
    return res.status(404).json({ error: 'User not found' });
  }

  const blog: HydratedDocument<Blog> = new BlogModel({
    title,
    author,
    url,
    likes,
    user: user?.id,
  });

  const createdBlog = await blog.save();
  userData.blogs = userData.blogs.concat(blog);
  await userData.save();

  res.status(201).json(createdBlog);
});

// Update blog
blogsRouter.put('/:id', middlewares.userExtractor, async (req, res) => {
  const { id } = req.params;
  const { title, author, url, likes } = req.body;
  const { user } = req;
  const blog = await BlogModel.findById(id, 'user');
  const userId = blog?.user.toString();

  if (blog && userId !== user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(
    id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' },
  ).populate('user', { id: 1 });

  updatedBlog ? res.json(updatedBlog) : res.sendStatus(404);
});

// Delete blog
blogsRouter.delete('/:id', middlewares.userExtractor, async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const blog = await BlogModel.findById(id, 'user');
  const userId = blog?.user.toString();

  if (blog && userId !== user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const deletedBlog = await BlogModel.findByIdAndDelete(id);
  deletedBlog ? res.sendStatus(204) : res.sendStatus(404);
});

export default blogsRouter;
