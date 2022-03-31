import { Router } from 'express';
import { Person, PersonModel } from '../models/Person';
import { HydratedDocument } from 'mongoose';

const personRouter = Router();

// Get all people
personRouter.get('/', async (req, res) => {
  const people = await PersonModel.find({});
  res.json(people);
});

// Get one person
personRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const person = await PersonModel.findById(id);
  person ? res.json(person) : res.sendStatus(404);
});

// Create person
personRouter.post('/', async (req, res) => {
  const { name, number } = req.body;
  const isMatch = await PersonModel.findOne({ name });

  if (isMatch) {
    return res.status(409).json({ error: 'Name must be unique' });
  }

  const person: HydratedDocument<Person> = new PersonModel({ name, number });
  const createdPerson = await person.save();
  res.status(201).json(createdPerson);
});

// Update person
personRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, number } = req.body;

  const updatedPerson = await PersonModel.findOneAndUpdate(
    { _id: id },
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  );

  res.json(updatedPerson);
});

// Delete person
personRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deletedPerson = await PersonModel.findByIdAndDelete({ _id: id });
  deletedPerson ? res.sendStatus(204) : res.sendStatus(404);
});

export default personRouter;
