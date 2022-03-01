import path from 'path';
import fs from 'fs';
import PersonInterface from '../models/Person';

const filepath = path.resolve(process.cwd(), 'db/persons.json');

const read = (): Promise<PersonInterface[]> => {
  return new Promise((resolve, reject) =>
    fs.readFile(filepath, 'utf8', (err, persons) =>
      resolve(JSON.parse(persons)),
    ),
  );
};

const save = (persons: PersonInterface[]): Promise<void> => {
  const formattedJson = `${JSON.stringify(persons, null, 2)}\n`;
  return new Promise((resolve, reject) =>
    fs.writeFile(filepath, formattedJson, () => resolve()),
  );
};

const personService = { read, save };
export default personService;
