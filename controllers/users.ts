import bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';
import { Router } from 'express';
import { User, UserModel } from '../models/User';

const usersRouter = Router();

// Get users
usersRouter.get('/', async (req, res) => {
  const users = await UserModel.find({}).populate('notes', {
    content: 1,
    date: 1,
  });
  res.json(users);
});

// Get a specific user
usersRouter.get('/:username', async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username }).populate('notes');
  user ? res.json(user) : res.status(404).json('User not found');
});

// Create user
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: 'Username must be unique',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user: HydratedDocument<User> = new UserModel({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

export default usersRouter;
