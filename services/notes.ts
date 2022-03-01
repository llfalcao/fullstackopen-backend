import path from 'path';
import fs from 'fs';
import NoteInterface from '../models/Note';

const filepath = path.resolve(
  process.cwd(),
  'db/notes.json',
);

const read = (): Promise<NoteInterface[]> => {
  return new Promise((resolve, reject) =>
    fs.readFile(filepath, 'utf8', (err, notes) =>
      resolve(JSON.parse(notes)),
    ),
  );
};

const save = (notes: NoteInterface[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, JSON.stringify(notes), () =>
      resolve(),
    );
  });
};

const noteService = { read, save };
export default noteService;
