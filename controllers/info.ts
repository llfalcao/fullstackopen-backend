import { Router } from 'express';
import { PersonModel } from '../models/Person';

const router = Router();

router.get('/', (req, res) => {
  PersonModel.find({}).then((people) => {
    const now = new Date().toUTCString();
    const output = `
    <p>Phonebook has info for ${people.length} ${
      people.length === 1 ? 'person' : 'people'
    }.</p>
    <p>${now}</p>
  `;

    res.send(output);
  });
});

export default router;
