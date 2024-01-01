import { Schema, model, ObjectId } from 'mongoose';

export interface Blog {
  title: string;
  author: string;
  url: string;
  likes: number;
  user: ObjectId;
}

const blogSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title required'],
  },
  author: {
    type: String,
    required: [true, 'Author required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  url: {
    type: String,
    required: [true, 'URL required'],
  },
  likes: {
    type: Number,
    default: 0,
  },
});

blogSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.user.blogs;
  },
});

export const BlogModel = model<Blog>('Blog', blogSchema);
