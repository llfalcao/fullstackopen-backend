import { Note, NoteModel } from '../models/Note';
import { Types } from 'mongoose';

const initialNotes: Note[] = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
];

const generateObjectId = () => new Types.ObjectId();

const notesInDb = async () => {
  const notes = await NoteModel.find({});
  return notes.map((n) => n.toJSON());
};

const helper = { initialNotes, generateObjectId, notesInDb };
export default helper;
