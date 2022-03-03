import { Router, Request, Response, NextFunction } from 'express';
import personService from '../services/persons';
import PersonInterface, { isPerson } from '../models/Person';

const router = Router();

// Get all 'persons'
router.get('/', (req, res) =>
  personService.read().then((persons) => res.json(persons)),
);

// Get one person
router.get('/:id', (req, res) => {
  const { id } = req.params;
  personService.read().then((persons) => {
    const person = persons.find((p) => p.id === Number(id));
    if (!person) return res.sendStatus(404);
    res.json(person);
  });
});

const handleMissingInfo = (req: Request, res: Response, next: NextFunction) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'name missing',
    });
  }

  if (!number) {
    return res.status(400).json({
      error: 'number missing',
    });
  }

  next();
};

// Create person
router.post('/', handleMissingInfo, (req, res) => {
  const { name, number } = req.body;

  personService.read().then((persons) => {
    const isDuplicate = persons.some((p) => p.name === name);
    if (isDuplicate) {
      return res.status(409).json({
        error: 'name must be unique',
      });
    }

    const id = Math.floor(Math.random() * 1000);
    const person: PersonInterface = { id, name, number };
    if (!isPerson(person)) {
      return res.status(400).json({
        error: 'invalid value type',
      });
    }

    personService.save(persons.concat(person)).then(() => res.json(person));
  });
});

// Update person
router.put('/:id', handleMissingInfo, (req, res) => {
  const { id } = req.params;
  const { name, number } = req.body;

  personService.read().then((persons) => {
    const index = persons.findIndex((p) => p.id === Number(id));
    if (!persons[index]) return res.sendStatus(404);

    persons[index] = { ...persons[index], name, number };

    if (!isPerson(persons[index])) {
      return res.status(400).json({
        error: 'invalid value type',
      });
    }

    personService.save(persons).then(() => res.json(persons[index]));
  });
});

// Delete person
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  personService.read().then((persons) => {
    const filteredPersons = persons.filter((p) => p.id !== Number(id));
    personService.save(filteredPersons).then(() => res.sendStatus(204));
  });
});

export default router;
