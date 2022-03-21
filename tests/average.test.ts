import { average } from '../utils/for_testing';

test('average of array', () => {
  const result = average([1, 2, 3, 4, 5]);
  expect(result).toBe(3);
});

test('average of array', () => {
  const result = average([5, 10, 15, 20, 25, 30]);
  expect(result).toBe(17.5);
});

test('average of array', () => {
  const result = average([2, 64, 578, 597, 52, 6]);
  expect(result).toBe(216.5);
});
