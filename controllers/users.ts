import bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';
import { Router } from 'express';
import { User, UserModel } from '../models/User';

const usersRouter = Router();

// Get users
usersRouter.get('/', async (req, res) => {
  const users = await UserModel.find({});
  res.json(users);
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
