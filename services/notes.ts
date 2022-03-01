import path from 'path';
import fs from 'fs';
import NoteInterface from '../models/Note';

const filepath = path.resolve(process.cwd(), 'db/notes.json');

const read = (): Promise<NoteInterface[]> => {
  return new Promise((resolve, reject) =>
    fs.readFile(filepath, 'utf8', (err, notes) => resolve(JSON.parse(notes))),
  );
};

const save = (notes: NoteInterface[]): Promise<void> => {
  const formattedJson = `${JSON.stringify(notes, null, 2)}\n`;
  return new Promise((resolve, reject) =>
    fs.writeFile(filepath, formattedJson, () => resolve()),
  );
};

const noteService = { read, save };
export default noteService;
