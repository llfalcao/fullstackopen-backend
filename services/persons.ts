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

const personService = { read };
export default personService;
