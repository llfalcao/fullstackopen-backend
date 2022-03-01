import { Router } from 'express';
import personService from '../services/persons';

const router = Router();

router.get('/', (req, res) => {
  personService.read().then((persons) => res.json(persons));
});

export default router;
