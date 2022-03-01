export default interface PersonInterface {
  id: number;
  name: string;
  number: string;
}

export const isPerson = (object: any): object is PersonInterface =>
  typeof object.name === 'string' && typeof object.number === 'string';
