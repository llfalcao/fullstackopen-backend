import { Router } from 'express';
import { Person, PersonModel } from '../models/Person';
import { HydratedDocument } from 'mongoose';

const router = Router();

// Get all people
router.get('/', (req, res) =>
  PersonModel.find({}).then((people) => res.json(people)),
);

// Get one person
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  PersonModel.findById(id)
    .then((person) => (person ? res.json(person) : res.sendStatus(404)))
    .catch((error) => next(error));
});

// Create person
router.post('/', (req, res, next) => {
  const { name, number } = req.body;

  PersonModel.findOne({ name }).then((match) => {
    if (match) {
      return res.status(409).json({ error: 'Name must be unique' });
    }

    const person: HydratedDocument<Person> = new PersonModel({ name, number });
    person
      .save()
      .then((createdPerson) => res.json(createdPerson))
      .catch((error) => next(error));
  });
});

// Update person
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  PersonModel.findOneAndUpdate(
    { _id: id },
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

// Delete person
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  PersonModel.findByIdAndDelete({ _id: id })
    .then((person) => (person ? res.sendStatus(204) : res.sendStatus(404)))
    .catch((error) => next(error));
});

export default router;
