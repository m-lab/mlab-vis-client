import d3 from 'd3';

/**
 * Compute the extent across an array of arrays/objects
 *
 * For example:
 * ```
 * multiExtent([[4, 3], [1, 2]], d => d);
 * > 1, 4
 * ```
 * ```
 * multiExtent([{ results: [{ x: 4 }, { x: 3 }] }, { results: [{ x: 1 }, { x: 2 }] }],
 *   d => d.x, array => array.results);
 * > 1, 4
 * ```
 *
 * @param {Array} outerArray An array of arrays or objects
 * @param {Function} [valueAccessor] How to read a value in the array (defaults to identity)
 * @param {Function} [arrayAccessor] How to read an inner array (defaults to identity)
 * @return {Array} the extent
 */
export function multiExtent(outerArray, valueAccessor = d => d, arrayAccessor = d => d) {
  if (!outerArray || !outerArray.length) {
    return undefined;
  }


  const innerExtents = outerArray.map(inner => arrayAccessor(inner))
    .map(inner => d3.extent(inner, valueAccessor));

  const extent = [d3.min(innerExtents, d => d[0]), d3.max(innerExtents, d => d[1])];
  return extent;
}

/**
 * Helper function to compute distance and find the closest item
 * Since it assumes the data is unsorted, it does a linear scan O(n).
 *
 * @param {Array} array the input array to search
 * @param {Number} value the value to match against (typically pixels)
 * @param {Function} accessor applied to each item in the array to get equivalent
 *   value to compare against
 * @return {Any} The item in the array that is closest to `value`
 */
export function findClosestUnsorted(array, value, accessor = d => d) {
  let closest = null;
  let closestDist = null;

  array.forEach((elem) => {
    const dist = Math.abs(accessor(elem) - value);
    if (closestDist == null || dist < closestDist) {
      closestDist = dist;
      closest = elem;
    }
  });

  return closest;
}

/**
 * Helper function to find the item that matches this value.
 * Since it assumes the data is unsorted, it does a linear scan O(n).
 *
 * @param {Array} array the input array to search
 * @param {Number} value the value to match against (typically pixels)
 * @param {Function} accessor applied to each item in the array to get equivalent
 *   value to compare against
 * @return {Any} The item in the array that has this value or null if not found
 */
export function findEqualUnsorted(array, value, accessor = d => d) {
  return array.find(d => accessor(d) === value);
}
