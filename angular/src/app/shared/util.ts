export function flatten<T>(arrayOfArrays: T[][]): T[] {
  return arrayOfArrays.reduce((accumulator, currentVal) => accumulator.concat(...currentVal), []);
}
