/**
 * Sum an array of values based on an accessor
 *
 * @param {Array} array The array of values
 * @param {Function|String} accessor If string, uses d => d[accessor] otherwise
 *    calls accessor(d) to sum the data
 * @return {Number} the sum
*/
export function sum(array, accessor) {
  if (!array) {
    return undefined;
  }

  if (typeof accessor === 'string') {
    const key = accessor;
    accessor = d => d[key];
  }

  return array.reduce((currentSum, d) => {
    const value = accessor(d);
    if (value != null) {
      currentSum += value;
    }

    return currentSum;
  }, 0);
}
