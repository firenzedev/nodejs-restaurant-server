const reduceToSingleUniqueValue = function (array) {
  return array
    .filter((x, i, a) => a.indexOf(x) === i)
    .reduce((_a, _b) => {
      throw new Error('Array has more than one unique value: cannot reduce to a single unique value');
    });
};

module.exports = {
  reduceToSingleUniqueValue,
};
