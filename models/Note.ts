import { model, ObjectId, Schema } from 'mongoose';

export interface Note {
  _id: ObjectId;
  content: string;
  date: string;
  important: boolean;
}

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const NoteModel = model('Note', noteSchema);

export const isNote = (object: any): object is Note =>
  typeof object.content === 'string' && typeof object.important === 'boolean';
