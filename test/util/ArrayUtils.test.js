const ArrayUtils = require('../../src/util/ArrayUtils');

test('reduceToSingleUniqueValue returns the single value of an array', () => {
  const input = [42, 42, 42, 42, 42, 42, 42, 42];
  const result = ArrayUtils.reduceToSingleUniqueValue(input);
  expect(result).toBe(42);
});

test('reduceToSingleUniqueValue throws an error if input array has more than one unique value', () => {
  const input = [42, 42, 42, 42, 42, 42, 42, 43];
  expect(() => ArrayUtils.reduceToSingleUniqueValue(input)).toThrow();
});
