const reverse = (string: string) => string.split('').reverse().join('');

const average = (numbers: number[]) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((sum, n) => sum + n, 0);
  return sum / numbers.length;
};

export { reverse, average };
