import path from "path";
import fs from "fs";
import NoteInterface from "../models/Note";

const read = (): Promise<NoteInterface[]> => {
  return new Promise((resolve, reject) =>
    fs.readFile(
      path.resolve(__dirname, "../db/notes.json"),
      "utf8",
      (err, notes) => resolve(JSON.parse(notes))
    )
  );
};

const save = (notes: NoteInterface[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(__dirname, "../db/notes.json"),
      JSON.stringify(notes),
      () => resolve()
    );
  });
};

const noteService = { read, save };
export default noteService;
