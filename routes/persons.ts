import { Router, Request, Response, NextFunction } from 'express';
import personService from '../services/persons';
import { Person, isPerson } from '../models/Person';
import { HydratedDocument, isValidObjectId } from 'mongoose';

const router = Router();

// Get all 'persons'
router.get('/', (req, res) =>
  personService.getAll().then((persons) => res.json(persons)),
);

// Get one person
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.sendStatus(404);
  }

  personService
    .get(id, null)
    ?.then((person) => (person ? res.json(person) : res.sendStatus(404)));
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

  if (!isPerson({ name, number })) {
    return res.status(400).json({
      error: 'invalid data type',
    });
  }

  personService.get(null, name)?.then((person) => {
    if (person && person.name === name) {
      return res.status(409).json({
        error: 'name must be unique',
      });
    }

    personService
      .create({ name, number })
      .then((createdPerson) => res.json(createdPerson));
  });
});

// Update person
router.put('/:id', handleMissingInfo, (req, res) => {
  const { id } = req.params;
  const { name, number } = req.body;

  if (!isValidObjectId(id)) {
    return res.sendStatus(404);
  }

  if (!isPerson({ name, number })) {
    return res.status(400).json({
      error: 'invalid data type',
    });
  }

  personService
    .update(id, { name, number })
    .then((updatedPerson) => res.json(updatedPerson));
});

// Delete person
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.sendStatus(404);
  }

  personService.remove(id).then((result) => {
    if (!result.acknowledged || result.deletedCount === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  });
});

export default router;
