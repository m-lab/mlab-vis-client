/**
 * Helper function to make an accessor from a string or function.
 *
 * @param {Function|String} stringOrFunc If string, creates d => d[stringOrFunc]
 *   otherwise returns stringOrFunc
 * @return {Function} The accessor
 **/
function makeAccessor(stringOrFunc) {
  if (typeof stringOrFunc === 'string') {
    const key = stringOrFunc;
    return d => d[key];
  }

  return stringOrFunc;
}

/**
 * Sum an array of values based on an accessor
 *
 * @param {Array} array The array of values
 * @param {Function|String} weightAccessor accessor function or string key
 * @return {Number} the sum
*/
export function sum(array, accessor) {
  if (!array || !array.length) {
    return undefined;
  }

  accessor = makeAccessor(accessor);

  return array.reduce((currentSum, d) => {
    const value = accessor(d);
    if (value != null) {
      currentSum += value;
    }

    return currentSum;
  }, 0);
}

/**
 * Compute the average of an array
 *
 * @param {Array} array The array of values
 * @param {Function|String} accessor accessor function or string key
 * @return {Number} the average
*/
export function average(array, accessor) {
  if (!array || !array.length) {
    return undefined;
  }

  accessor = makeAccessor(accessor);
  const filtered = array.filter(d => accessor(d) != null);

  return sum(filtered, accessor) / filtered.length;
}


/**
 * Compute the weighted average of an array: sum(weight * value) / sum(weight)
 *
 * @param {Array} array The array of values
 * @param {Function|String} valueAccessor accessor function or string key
 * @param {Function|String} weightAccessor accessor function or string key
 * @return {Number} the sum
*/
export function weightedAverage(array, valueAccessor, weightAccessor) {
  if (!array || !array.length) {
    return undefined;
  }

  weightAccessor = makeAccessor(weightAccessor);
  valueAccessor = makeAccessor(valueAccessor);
  const filtered = array.filter(d => weightAccessor(d) != null && valueAccessor(d) != null);

  return sum(filtered, d => weightAccessor(d) * valueAccessor(d)) /
         sum(filtered, weightAccessor);
}
