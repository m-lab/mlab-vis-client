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
