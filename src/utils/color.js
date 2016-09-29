
import d3 from 'd3';
import { mod } from './math';

// colors come from: http://tools.medialab.sciences-po.fr/iwanthue/
const HCL_COLORS = [
  [58, 41.304, 34.656],
  [298, 75.161, 42.059],
  [137, 64.651, 58.731],
  [328, 84.426, 53.029],
  [120, 47.749, 58.34],
  [311, 82.059, 43.205],
  [98, 51.58, 57.183],
  [313, 67.87, 28.574],
  [64, 62.705, 58.549],
  [284, 55.45, 55.61],
  [37, 74.374, 52.407],
  [304, 65.081, 55.232],
  [127, 39.378, 37.807],
  [340, 73.623, 55.366],
  [165, 36.472, 56.113],
  [359, 66.681, 52.232],
  [269, 34.85, 55.85],
  [39, 58.141, 37.967],
  [297, 49.28, 31.17],
  [77, 39.453, 52.82],
  [321, 66.556, 56.371],
  [37, 43.641, 57.443],
  [304, 36.142, 30.132],
  [14, 56.059, 50.812],
  [309, 43.404, 55.378],
  [15, 38.89, 30.752],
  [333, 60.682, 40.155],
  [345, 42.869, 60.46],
  [335, 43.323, 26.682],
  [345, 39.365, 43.355],
];

/**
 * Converts a ASN string to a number from 0 to maxCount.
 * Expects ASN string to have digits in it, and in format following: `AS123`.
 *
 * @param {String} asnNumber Number string to hash
 * @param {Integer} maxCount Largest number to allow.
 * @return {Integer} value between 0 and maxCount
 */
export function hashAsn(asnNumber, maxCount) {
  if (!asnNumber) {
    return 0;
  }
  const asn = parseInt(asnNumber.replace(/\D+/g, ''), 10);
  return mod(asn, maxCount);
}

/**
 * Converts a string to a number from 0 to maxCount.
 *
 * @param {String} string string to hash
 * @param {Integer} maxCount Largest number to allow.
 * @return {Integer} value between 0 and maxCount
 */
export function hashString(string, maxCount) {
  if (!string) {
    return 0;
  }

  const sum = d3.sum(string.split('').map(ch => ch.charCodeAt(0) * ch.charCodeAt(0)));
  return mod(sum, maxCount);
}

/**
 * Change brightness of overlapping colors.
 * @param {Array} colors Array of d3.color values
 * @param {Array} Array of overlap objects. Overlap created using d3.nest
 *  will have a `values` array attribute - an entry for each value in colors
 *  that are the same color. Each entry in values has a `index` attribute indicating
 *  the position in `colors` for that color.
 * @return {Array} Array of d3.color values altered so that none overlap.
 */
function varyColor(colors, overlaps) {
  overlaps.forEach((overlap) => {
    const length = overlap.values.length;
    if (length > 1) {
      let brightenToggle = true;
      let k = 1.0;
      // Start at the 2nd overlapping index
      for (let i = 1; i < length; i++) {
        const index = overlap.values[i].index;

        // brighten / darken matching colors.
        // Alternate between brightening and darkening.
        colors[index] = (brightenToggle) ? colors[index].brighter(k) : colors[index].darker(k);
        brightenToggle = !brightenToggle;
        // amount to brigten/darken by increases if we have used that same value
        // to brigten and darken already.
        if (brightenToggle) {
          k += 1.0;
        }
      }
    }
  });

  return colors;
}

/**
 * Create an array of colors, one for each entry in values. Colors will not overlap,
 * but remain consistent based on `hashFunction`.
 * @param {Array} values Array to extract colors for.
 * @param {Function} valueAccessor Function to pull out the value from values with.
 *  defaults to identity function.
 * @param {Function} hashFunction Function to convert value to an index into color array.
 *  defaults to hashAsn which expects value to be ASN strings.
 * @return {Array} Array of Color strings in order of values.
 */
export function extractColors(values, valueAccessor = d => d, hashFunction = hashString) {
  const maxCount = HCL_COLORS.length;
  const indexes = values.map((v, i) => ({ index: i, hash: hashFunction(valueAccessor(v), maxCount) }));

  const colors = indexes.map((h) => d3.hcl(...HCL_COLORS[h.hash]));

  // groups by hash value - so we can easily find duplicate colors.
  // alternative would be to rely on comparing d3.color values inside `varyColor`
  const overlaps = d3.nest()
    .key((d) => d.hash)
    .entries(indexes);

  const variedColors = varyColor(colors, overlaps);

  return variedColors.map((c) => c.toString());
}

/**
 * Create an object of colors, with entries in `values` as attributes.
 * Each value is a color string. Colors will not overlap
 * but remain consistent based on `hashFunction`.
 * @param {Array} values Array to extract colors for.
 * @param {Function} valueAccessor Function to pull out the value from values with.
 *  defaults to identity function.
 * @param {Function} keyAccessor Function to pull out the key from the values.
 *  default to the valueAccessor.
 * @param {Function} hashFunction Function to convert value to an index into color array.
 *  defaults to hashAsn which expects value to be ASN strings.
 * @return {Object} With a key for each value in values.
 */
export function colorsFor(values = [], valueAccessor = d => d, keyAccessor, hashFunction = hashString) {
  keyAccessor = keyAccessor || valueAccessor;
  const colors = extractColors(values, valueAccessor, hashFunction);
  const colorMap = {};
  colors.forEach((color, index) => {
    colorMap[keyAccessor(values[index])] = color;
  });

  return colorMap;
}
