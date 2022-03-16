import { Router } from 'express';
import personService from '../services/persons';

const router = Router();

router.get('/', (req, res) => {
  console.log('router');
  personService.getAll().then((persons) => {
    const now = new Date().toUTCString();
    const output = `
      <p>Phonebook has info for ${persons.length} ${
      persons.length === 1 ? 'person' : 'people'
    }.</p>
      <p>${now}</p>
    `;
    res.send(output);
  });
});

export default router;
