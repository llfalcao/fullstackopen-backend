import { model, Schema } from 'mongoose';

export interface Note {
  content: string;
  date: Date;
  important: boolean;
}

const noteSchema = new Schema({
  content: {
    type: String,
    trim: true,
    minlength: [5, 'Note is too short'],
    match: [/.*\S.*/, 'Note must not contain only spaces'],
    required: [true, 'Content missing'],
  },
  date: {
    type: Date,
    required: true,
  },
  important: {
    type: Boolean,
    default: false,
  },
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const NoteModel = model<Note>('Note', noteSchema);
