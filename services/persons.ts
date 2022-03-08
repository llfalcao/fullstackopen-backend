import { PersonModel, Person } from '../models/Person';
import { HydratedDocument, isValidObjectId } from 'mongoose';

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

const create = (personObject: {
  name: string;
  number: string;
}): Promise<Person> => {
  const person: HydratedDocument<Person> = new PersonModel({ ...personObject });
  return person.save().then((result) => result);
};

const update = (
  id: string,
  data: { name: string; number: string },
): Promise<Person> =>
  PersonModel.findOneAndUpdate({ _id: id }, data, { new: true }).then(
    (result) => result,
  );

const remove = (id: string) =>
  PersonModel.deleteOne({ _id: id }).then((result) => result);

const personService = { getAll, get, create, update, remove };
export default personService;
