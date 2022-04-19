import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { UserModel } from '../models/User';

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!user || !passwordCorrect) {
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const tokenData = { username: user.username, id: user._id };
  const token = jwt.sign(tokenData, process.env.SECRET as string);

  res.json({ token, username: user.username, name: user.name });
});

export default loginRouter;
