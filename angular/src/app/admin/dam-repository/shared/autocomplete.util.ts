import _get from 'lodash.get';

// Flattens an array of arrays: [1, [a, b], [c], d] = [1, a, b, c, d]
export const flatten = (arrays: Array<string>) => [].concat.apply([], arrays);

// A wrapper for the _get function.
export const pick = (fieldName, fallback?) => (entity) => _get(entity, fieldName, fallback);

// Picks particular fields from a collection (collection = array of objects).
export const pluck = (fieldName, fallback) => (array) => array.map(pick(fieldName, fallback));

// A wrapper for a filter function.
export const filterBy = (filterFn) => (array) => array.filter(filterFn);

// To be used in filter function. Assumes there is no other item with the same value to the left of the inspected item.
export const isMostLeft = (value, index, self) => self.indexOf(value) === index;

export const includes = (substr) => (value) => value.includes(substr);

// Filters out repetitions from an array.
export const makeDistinct = filterBy(isMostLeft);



