import { model, ObjectId, Schema } from 'mongoose';

export interface Person {
  _id: ObjectId;
  name: string;
  number: string;
}

const personSchema = new Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const PersonModel = model('Person', personSchema);

export const isPerson = (object: any): object is Person =>
  typeof object.name === 'string' && typeof object.number === 'string';
