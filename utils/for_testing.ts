const reverse = (string: string) => string.split('').reverse().join('');
const average = (numbers: number[]) => {
  const sum = numbers.reduce((sum, n) => sum + n, 0);
  return sum / numbers.length;
};

export { reverse, average };
