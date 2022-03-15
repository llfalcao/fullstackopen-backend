import { Router, Request, Response, NextFunction } from 'express';
import personService from '../services/persons';

const router = Router();

// Get all people
router.get('/', (req, res) =>
  personService.getAll().then((persons) => res.json(persons)),
);

// Get one person
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  personService
    .get(id, null)
    ?.then((person) => (person ? res.json(person) : res.sendStatus(404)))
    .catch((error) => next(error));
});

const handleMissingInfo = (req: Request, res: Response, next: NextFunction) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'Name missing',
    });
  }

  if (!number) {
    return res.status(400).json({
      error: 'Number missing',
    });
  }

  next();
};

// Create person
router.post('/', handleMissingInfo, (req, res, next) => {
  const { name, number } = req.body;

  personService.get(null, name)?.then((person) => {
    if (person && person.name === name) {
      return res.status(409).json({
        error: 'Name must be unique',
      });
    }

    personService
      .create({ name, number })
      .then((createdPerson) => res.json(createdPerson))
      .catch((error) => next(error));
  });
});

// Update person
router.put('/:id', handleMissingInfo, (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  personService
    .update(id, { name, number })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

// Delete person
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  personService
    .remove(id)
    .then((result) => {
      if (!result.acknowledged || result.deletedCount === 0) {
        return res.sendStatus(404);
      }
      res.sendStatus(204);
    })
    .catch((error) => next(error));
});

export default router;
