export default interface NoteInterface {
  id: number;
  content: string;
  date: string;
  important: boolean;
}

export const isNote = (object: any): object is NoteInterface =>
  typeof object.content === 'string' && typeof object.important === 'boolean';
