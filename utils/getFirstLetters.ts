export const getFirstLetters = (str: string) =>
  str
    .split(' ')
    .map((item: string) => item.charAt(0))
    .join('');
