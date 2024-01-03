import { Schema, model } from 'mongoose';
import { Blog } from './Blog';
import { Note } from './Note';

export interface User {
  username: string;
  name: string;
  passwordHash: string;
  notes: Note[];
  blogs: Blog[];
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username required'],
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

UserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

export const UserModel = model<User>('User', UserSchema);
