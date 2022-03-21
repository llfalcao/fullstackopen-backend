import { reverse } from '../utils/for_testing';

test('reverse of a', () => {
  const result = reverse('a');
  expect(result).toBe('a');
});
