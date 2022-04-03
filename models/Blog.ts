import { Schema, model } from 'mongoose';

export interface Blog {
  title: string;
  author: string;
  url: string;
  likes: number;
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
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const BlogModel = model<Blog>('Blog', blogSchema);
