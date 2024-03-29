import { model, Schema } from 'mongoose';

export interface Person {
  name: string;
  number: string;
}

const personSchema = new Schema({
  name: {
    type: String,
    trim: true,
    minlength: [3, 'Name is too short'],
    required: true,
  },
  number: {
    type: String,
    trim: true,
    match: [/^\S+$/, 'Number must not contain spaces'],
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const PersonModel = model<Person>('Person', personSchema);
