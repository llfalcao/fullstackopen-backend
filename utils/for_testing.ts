const reverse = (string: string) => string.split('').reverse().join('');

const average = (numbers: number[]) => {
  const reducer = (sum: number, n: number) => sum + n;

  if (numbers.length === 0) return 0;
  return numbers.reduce(reducer, 0) / numbers.length;
};

export { reverse, average };
