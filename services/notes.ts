import { Note, NoteModel } from '../models/Note';
import { HydratedDocument } from 'mongoose';

interface NoteBody {
  content: string;
  important: boolean;
}

const getAll = (): Promise<Note[]> =>
  NoteModel.find({}).then((result) => result);

const get = (id: string): Promise<Note> =>
  NoteModel.findById(id).then((result) => result);

const create = (data: NoteBody): Promise<Note> => {
  const note: HydratedDocument<Note> = new NoteModel({
    date: new Date(),
    ...data,
  });
  return note.save().then((result) => result);
};

const update = (id: string, data: NoteBody) =>
  NoteModel.findByIdAndUpdate(id, data, { new: true }).then((result) => result);

const remove = (id: string) =>
  NoteModel.findByIdAndDelete(id).then((result) => result);

const noteService = { getAll, get, create, update, remove };
export default noteService;
