export const capitalize = ({ value }: { value: string }) =>
  value
    ?.split(' ')
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(' ')
    .trim();
