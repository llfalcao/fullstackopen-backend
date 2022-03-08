import { Note, NoteModel } from '../models/Note';
import { HydratedDocument } from 'mongoose';

const getAll = (): Promise<Note[]> =>
  NoteModel.find({}).then((result) => result);

const get = (id: string): Promise<Note> =>
  NoteModel.findById(id).then((result) => result);

const create = (noteObject: HydratedDocument<Note>) =>
  noteObject.save().then((result) => result);

const update = (id: string, data: { content: string; important: boolean }) =>
  NoteModel.findByIdAndUpdate(id, data, { new: true }).then((result) => result);

const remove = (id: string) =>
  NoteModel.findByIdAndDelete(id).then((result) => result);

const noteService = { getAll, get, create, update, remove };
export default noteService;
