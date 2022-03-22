import { Schema, model } from 'mongoose';

export interface Blog {
  title: string;
  author: string;
  url: string;
  likes: number;
}

const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const BlogModel = model<Blog>('Blog', blogSchema);
