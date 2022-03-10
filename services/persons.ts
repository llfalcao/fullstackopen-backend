import { PersonModel, Person } from '../models/Person';
import { HydratedDocument, isValidObjectId } from 'mongoose';

interface PersonBody {
  name: string;
  number: string;
}

const getAll = (): Promise<Person[]> =>
  PersonModel.find({}).then((result) => result);

const get = (
  id: string | null,
  name: string | null,
): Promise<Person> | null | undefined => {
  if (id) {
    return PersonModel.findById(id).then((result) => result);
  } else if (name) {
    return PersonModel.findOne({ name }).then((result) => result);
  }
};

const create = (data: PersonBody): Promise<Person> => {
  const person: HydratedDocument<Person> = new PersonModel({ ...data });
  return person.save().then((result) => result);
};

const update = (id: string, data: PersonBody): Promise<Person> =>
  PersonModel.findOneAndUpdate({ _id: id }, data, { new: true }).then(
    (result) => result,
  );

const remove = (id: string) =>
  PersonModel.deleteOne({ _id: id }).then((result) => result);

const personService = { getAll, get, create, update, remove };
export default personService;
