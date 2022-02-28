export default interface NoteInterface {
  id: number;
  content: string;
  date: string;
  important: boolean;
}

export function isNote(object: any): object is NoteInterface {
  return (
    typeof object.content === "string" && typeof object.important === "boolean"
  );
}
