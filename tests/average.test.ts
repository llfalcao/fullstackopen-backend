import { average } from '../utils/for_testing';

test('average of array', () => {
  const result = average([1, 2, 3, 4, 5]);
  expect(result).toBe(3);
});
