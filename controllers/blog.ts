import { Router } from 'express';
import { Blog, BlogModel } from '../models/Blog';
import { HydratedDocument } from 'mongoose';

const blogRouter = Router();

// Get all blogs
blogRouter.get('/', (req, res) => {
  BlogModel.find({}).then((blogs) => res.json(blogs));
});

// Create blog
blogRouter.post('/', (req, res, next) => {
  const { title, author, url, likes } = req.body;

  const blog: HydratedDocument<Blog> = new BlogModel({
    title,
    author,
    url,
    likes,
  });

  blog
    .save()
    .then((result) => res.status(201).json(result))
    .catch((error) => next(error));
});

export default blogRouter;
