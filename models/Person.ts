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

export const PersonModel = model('Person', personSchema);

export const isPerson = (object: any): object is Person =>
  typeof object.name === 'string' && typeof object.number === 'string';
