import { Router } from 'express';
import personService from '../services/persons';

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

// Delete person
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  personService.read().then((persons) => {
    const filteredPersons = persons.filter((p) => p.id !== Number(id));
    personService.save(filteredPersons).then(() => res.sendStatus(204));
  });
});

export default router;
